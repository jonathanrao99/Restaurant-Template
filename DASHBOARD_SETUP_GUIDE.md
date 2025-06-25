# Desi Flavors Dashboard Setup Guide

This guide will help you set up the complete minimalistic dashboard with Umami analytics, newsletter management, blog CMS, and multi-platform review collection.

## 🚀 Features Included

- **Minimalistic Dashboard**: Clean, modern interface with key metrics
- **Umami Analytics Integration**: Real-time website analytics
- **Square Data Integration**: Sales and payment data
- **Newsletter Management**: Subscriber management and email campaigns
- **Blog CMS**: Full content management system
- **Multi-Platform Reviews**: Google, Facebook, and website reviews
- **Automated Feedback Emails**: Post-delivery review requests

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Supabase Project** (for database)
3. **Umami Analytics Account** (for website tracking)
4. **Email Service** (Gmail, SendGrid, or other SMTP provider)
5. **Square Account** (for payment data)

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install @types/nodemailer nodemailer @tinymce/tinymce-react tinymce --legacy-peer-deps
```

### 2. Database Setup

Run the database setup script in your Supabase SQL editor:

```bash
# Execute the SQL script
psql $DATABASE_URL -f scripts/setup-dashboard-tables.sql
```

Or manually run the SQL from `scripts/setup-dashboard-tables.sql` in Supabase dashboard.

### 3. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Umami Analytics
UMAMI_API_TOKEN=your_umami_api_token
UMAMI_WEBSITE_ID=0ab19376-7ad8-48fc-8f59-c69951883021

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@yourdomain.com

# Square API
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_APPLICATION_ID=your_square_application_id
SQUARE_ENVIRONMENT=sandbox

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
ADMIN_PASSCODE=your_admin_passcode
```

## 🔧 Configuration Steps

### 1. Umami Analytics Setup

1. **Create Umami Account**: Visit [Umami Cloud](https://cloud.umami.is) or self-host
2. **Add Your Website**: Add your domain to track
3. **Get API Token**: 
   - Go to Settings → API Keys
   - Create a new API key
   - Copy the token to `UMAMI_API_TOKEN`
4. **Get Website ID**: Copy from your website settings to `UMAMI_WEBSITE_ID`

### 2. Email Service Setup

#### Option A: Gmail SMTP
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password: Google Account → Security → App passwords
3. Use the app password in `SMTP_PASS`

#### Option B: SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

### 3. Square Integration

1. **Square Developer Dashboard**: Visit [Square Developer](https://developer.squareup.com)
2. **Create Application**: Create a new application
3. **Get Credentials**:
   - Application ID → `SQUARE_APPLICATION_ID`
   - Access Token → `SQUARE_ACCESS_TOKEN`
   - Set environment to `sandbox` for testing, `production` for live

### 4. Review Collection Setup

#### Google Reviews (Optional)
1. **Google Cloud Console**: Enable Places API
2. **API Key**: Create and configure API key
3. **Place ID**: Find your business place ID using [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)

#### Facebook Reviews (Optional)
1. **Facebook Developers**: Create a Facebook app
2. **Page Access Token**: Generate long-lived page access token
3. **Page ID**: Get your Facebook page ID

## 📊 Dashboard Features

### Main Dashboard
- **Real-time Metrics**: Sales, orders, visitors, reviews
- **Trend Analysis**: Day-over-day comparisons
- **Quick Actions**: Access to all management tools
- **Alerts**: Pending orders, low ratings, high bounce rates

### Analytics Integration
- **Umami Data**: Website visitors, page views, events
- **Square Data**: Payment transactions, sales trends
- **QR Analytics**: Scan tracking and conversions
- **Custom Events**: Track user interactions

### Newsletter Management
- **Subscriber Management**: View and manage email subscribers
- **Campaign Creation**: Rich text editor for newsletters
- **Statistics**: Open rates, click tracking
- **Automated Campaigns**: Welcome emails, promotional content

### Blog CMS
- **Post Editor**: Rich text editor with preview
- **SEO Optimization**: Meta descriptions, slugs, tags
- **Publishing Control**: Draft/publish workflow
- **Media Management**: Featured images, content images

### Review Collection
- **Multi-Platform**: Google, Facebook, website reviews
- **Automated Emails**: Post-delivery feedback requests
- **Response Management**: Reply to reviews directly
- **Analytics**: Rating trends, response rates

## 🚦 Post-Delivery Email Automation

The system automatically sends feedback emails 6 hours after order delivery:

```javascript
// Example webhook integration for order status updates
fetch('/api/reviews', {
  method: 'POST',
  body: JSON.stringify({
    action: 'sendFeedbackEmail',
    orderId: order.id,
    customerEmail: order.customer_email,
    customerName: order.customer_name
  })
});
```

## 🎨 Customization

### Theme Colors
The dashboard uses the existing Desi Flavors color scheme:
- Primary: `desi-orange` (#ff6b35)
- Text: Various gray shades
- Backgrounds: White and light gray

### Adding Custom Metrics
To add custom metrics to the dashboard:

1. **Create API Endpoint**: Add new data source
2. **Update Dashboard Component**: Modify `MinimalisticDashboard.tsx`
3. **Add Metric Card**: Include in metrics array

### Custom Email Templates
Email templates can be customized in:
- Newsletter: `/api/newsletter` route
- Feedback emails: `/api/reviews` route

## 📱 Mobile Responsiveness

The dashboard is fully responsive with:
- **Mobile Navigation**: Collapsible sidebar
- **Touch-Friendly**: Large buttons and touch targets
- **Responsive Grid**: Adapts to screen size
- **Optimized Loading**: Fast performance on mobile

## 🔒 Security Features

- **Route Protection**: Passcode-based admin access
- **RLS Policies**: Database-level security
- **Input Validation**: Server-side validation
- **CSRF Protection**: Built-in Next.js protection

## 🚀 Going Live

1. **Environment**: Update environment variables for production
2. **Domain**: Configure your production domain
3. **SSL**: Ensure HTTPS is enabled
4. **Analytics**: Switch Umami to production mode
5. **Email**: Configure production email service
6. **Square**: Switch to production environment

## 📈 Monitoring & Analytics

### Key Metrics to Monitor
- **Sales**: Daily/weekly revenue trends
- **Orders**: Order volume and average value
- **Website**: Traffic sources and conversions
- **Reviews**: Rating averages and response rates
- **Newsletter**: Subscriber growth and engagement

### Setting Up Alerts
Configure alerts for:
- High pending order count
- Low review ratings
- Website downtime
- Failed email deliveries

## 🆘 Troubleshooting

### Common Issues

**Dashboard Not Loading**
- Check environment variables
- Verify database connection
- Check console for errors

**Emails Not Sending**
- Verify SMTP credentials
- Check email service limits
- Review email templates

**Analytics Not Updating**
- Verify Umami API token
- Check website ID
- Ensure proper tracking setup

**Review Collection Issues**
- Verify API credentials
- Check rate limits
- Review webhook configuration

## 📞 Support

For additional support:
1. Check console logs for errors
2. Verify all environment variables
3. Test API endpoints individually
4. Review database permissions

## 🔄 Updates & Maintenance

### Regular Tasks
- **Database Cleanup**: Archive old analytics data
- **Email Lists**: Clean inactive subscribers
- **Review Monitoring**: Respond to customer feedback
- **Content Updates**: Keep blog content fresh

### Backup Strategy
- **Database**: Regular Supabase backups
- **Configuration**: Version control environment files
- **Content**: Export blog posts and newsletters

This setup provides a comprehensive, production-ready dashboard system for managing your restaurant's digital presence and customer engagement. 