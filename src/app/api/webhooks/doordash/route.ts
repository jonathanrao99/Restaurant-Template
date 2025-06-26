import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment } from 'square/legacy';
import { createHmac } from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Square client using legacy SDK
const client = new Client({
  bearerAuthCredentials: { accessToken: process.env.SQUARE_ACCESS_TOKEN! },
  environment:
    process.env.SQUARE_ENVIRONMENT?.toLowerCase() === 'production'
      ? Environment.Production
      : Environment.Sandbox,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// DoorDash JWT generator for potential cancels (not needed here)
async function generateDoorDashJWT() {
  const developer_id = process.env.DOORDASH_DRIVE_DEVELOPER_ID;
  const key_id = process.env.DOORDASH_DRIVE_KEY_ID;
  const signing_secret = process.env.DOORDASH_DRIVE_SIGNING_SECRET;
  if (!developer_id || !key_id || !signing_secret) throw new Error('Missing DoorDash credentials');
  const header = { alg: 'HS256', typ: 'JWT', 'dd-ver': 'DD-JWT-V1' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 300;
  const payload = { aud: 'doordash', iss: developer_id, kid: key_id, iat, exp };
  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const dataToSign = `${headerB64}.${payloadB64}`;
  const signature = createHmac('sha256', Buffer.from(signing_secret, 'base64'))
    .update(dataToSign)
    .digest('base64url');
  return `${dataToSign}.${signature}`;
}

// Map DoorDash statuses to our internal statuses
const statusMapping: Record<string, string> = {
  'quote': 'quoted',
  'confirmed': 'confirmed',
  'dasher_confirmed': 'dasher_assigned',
  'pickup_arrived': 'dasher_at_pickup',
  'picked_up': 'picked_up',
  'dropoff_arrived': 'dasher_at_dropoff', 
  'delivered': 'delivered',
  'cancelled': 'cancelled',
  'returned': 'returned'
};

// Detailed status descriptions for logging
const statusDescriptions: Record<string, string> = {
  'quote': 'Quote created, awaiting confirmation',
  'confirmed': 'Delivery confirmed, searching for dasher',
  'dasher_confirmed': 'Dasher assigned and confirmed',
  'pickup_arrived': 'Dasher arrived at pickup location',
  'picked_up': 'Order picked up by dasher',
  'dropoff_arrived': 'Dasher arrived at customer location',
  'delivered': 'Order successfully delivered',
  'cancelled': 'Delivery cancelled',
  'returned': 'Order returned to merchant'
};

// Determine if status requires immediate action
const requiresAction: Record<string, boolean> = {
  'dasher_confirmed': true, // Notify kitchen to prepare
  'pickup_arrived': true,   // Order should be ready
  'picked_up': true,        // Update customer
  'delivered': true,        // Complete order
  'cancelled': true,        // Handle cancellation
  'returned': true          // Handle return
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('DoorDash webhook received:', {
      event_id: body.event_id,
      event_type: body.event_type,
      delivery_id: body.data?.external_delivery_id,
      status: body.data?.delivery_status,
      timestamp: new Date().toISOString()
    });

    // Handle delivery status updates
    if (body.event_type === 'delivery_status') {
      const deliveryData = body.data;
      const externalDeliveryId = deliveryData.external_delivery_id;
      const newStatus = deliveryData.delivery_status;
      const dasherInfo = deliveryData.dasher;
      const trackingUrl = deliveryData.tracking_url;
      const estimatedPickupTime = deliveryData.pickup_time_estimated;
      const estimatedDeliveryTime = deliveryData.dropoff_time_estimated;

      if (!externalDeliveryId || !newStatus) {
        console.error('Invalid webhook payload: missing external_delivery_id or delivery_status', {
          external_delivery_id: externalDeliveryId,
          delivery_status: newStatus,
          full_payload: body
        });
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
      }

      console.log(`Processing status update: ${newStatus} (${statusDescriptions[newStatus] || 'Unknown status'})`, {
        external_delivery_id: externalDeliveryId,
        dasher_name: dasherInfo?.name,
        dasher_phone: dasherInfo?.phone_number,
        tracking_url: trackingUrl,
        pickup_eta: estimatedPickupTime,
        delivery_eta: estimatedDeliveryTime
      });

      // Find the order in our database
      const { data: orders, error: fetchError } = await supabase
        .from('orders')
        .select('id,status,customer_email,customer_name,customer_phone,delivery_address')
        .eq('external_delivery_id', externalDeliveryId);
      
      if (fetchError || !orders || orders.length === 0) {
        console.error('Failed to find order:', {
          error: fetchError,
          external_delivery_id: externalDeliveryId,
          orders_found: orders?.length || 0
        });
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      
      const order = orders[0];
      
      if (!order) {
        console.error('No order found for external_delivery_id:', externalDeliveryId);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const mappedStatus = statusMapping[newStatus] || newStatus;
      console.log(`Updating order ${order.id}:`, {
        from_status: order.status,
        to_status: mappedStatus,
        customer: order.customer_name,
        requires_action: requiresAction[newStatus] || false
      });

      // Update order status in database
      const updateData: any = { 
        status: mappedStatus,
        updated_at: new Date().toISOString()
      };
      
      // Add additional fields based on status
      if (trackingUrl) updateData.tracking_url = trackingUrl;
      if (estimatedPickupTime) updateData.estimated_pickup_time = estimatedPickupTime;
      if (estimatedDeliveryTime) updateData.estimated_delivery_time = estimatedDeliveryTime;
      if (dasherInfo) {
        updateData.dasher_name = dasherInfo.name;
        updateData.dasher_phone = dasherInfo.phone_number;
      }
      
      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', order.id);
      
      if (updateError) {
        console.error('Failed to update order status:', {
          error: updateError,
          order_id: order.id,
          update_data: updateData
        });
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
      }

      console.log('Order status updated successfully:', {
        order_id: order.id,
        new_status: mappedStatus,
        updated_fields: Object.keys(updateData)
      });
      
      // Handle status-specific actions
      try {
        await handleStatusActions(newStatus, order, deliveryData);
      } catch (actionError) {
        console.error('Error handling status-specific actions:', {
          error: actionError,
          status: newStatus,
          order_id: order.id
        });
        // Don't fail the webhook for action errors
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing DoorDash webhook:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle status-specific actions
async function handleStatusActions(status: string, order: any, deliveryData: any) {
  switch (status) {
    case 'dasher_confirmed':
      console.log(`Dasher ${deliveryData.dasher?.name} assigned to order ${order.id}`);
      // Could send notification to kitchen/staff
      break;
      
    case 'pickup_arrived':
      console.log(`Dasher arrived for pickup of order ${order.id}`);
      // Could send alert to prepare order if not ready
      break;
      
    case 'picked_up':
      console.log(`Order ${order.id} picked up, en route to customer`);
      // Could send SMS to customer with tracking info
      break;
      
    case 'delivered':
      console.log(`Order ${order.id} successfully delivered to ${order.customer_name}`);
      // Could trigger review request or loyalty points
      break;
      
    case 'cancelled':
      console.log(`Delivery for order ${order.id} was cancelled`);
      // Could trigger refund process or customer notification
      break;
      
    case 'returned':
      console.log(`Order ${order.id} was returned to store`);
      // Could trigger refund and inventory adjustment
      break;
      
    default:
      console.log(`Status ${status} for order ${order.id} - no specific action required`);
  }
} 