-- =====================================================
-- Desi Flavors Hub - Database Improvements
-- =====================================================

-- 1. Create Loyalty Redemptions Table
CREATE TABLE IF NOT EXISTS loyalty_redemptions (
  id SERIAL PRIMARY KEY,
  customer_identifier TEXT NOT NULL,
  points_redeemed INTEGER NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  redeemed_at TIMESTAMP DEFAULT NOW(),
  order_id INTEGER REFERENCES orders(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create Customer Profiles Table (for future use)
CREATE TABLE IF NOT EXISTS customer_profiles (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  name TEXT NOT NULL,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  loyalty_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
  birthday DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create Menu Item Analytics Table
CREATE TABLE IF NOT EXISTS menu_analytics (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL,
  item_name TEXT NOT NULL,
  date DATE NOT NULL,
  orders_count INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(item_id, date)
);

-- 4. Create Promotional Codes Table
CREATE TABLE IF NOT EXISTS promotional_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create Order Tracking Events Table
CREATE TABLE IF NOT EXISTS order_tracking_events (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  event_type TEXT NOT NULL,
  event_description TEXT,
  event_timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- =====================================================
-- Performance Indexes
-- =====================================================

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_scheduled_time ON orders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON orders(order_type);

-- Loyalty redemptions indexes
CREATE INDEX IF NOT EXISTS idx_loyalty_redemptions_customer ON loyalty_redemptions(customer_identifier);
CREATE INDEX IF NOT EXISTS idx_loyalty_redemptions_order ON loyalty_redemptions(order_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_redemptions_date ON loyalty_redemptions(redeemed_at);

-- Menu analytics indexes
CREATE INDEX IF NOT EXISTS idx_menu_analytics_item ON menu_analytics(item_id);
CREATE INDEX IF NOT EXISTS idx_menu_analytics_date ON menu_analytics(date);
CREATE INDEX IF NOT EXISTS idx_menu_analytics_revenue ON menu_analytics(revenue DESC);

-- Customer profiles indexes
CREATE INDEX IF NOT EXISTS idx_customer_profiles_email ON customer_profiles(email);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_phone ON customer_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_tier ON customer_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_total_spent ON customer_profiles(total_spent DESC);

-- Order tracking events indexes
CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON order_tracking_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_event_type ON order_tracking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_order_tracking_timestamp ON order_tracking_events(event_timestamp);

-- =====================================================
-- Useful Views for Analytics
-- =====================================================

-- Customer loyalty summary view
CREATE OR REPLACE VIEW customer_loyalty_summary AS
SELECT 
  COALESCE(customer_email, customer_phone) as customer_identifier,
  customer_name,
  customer_email,
  customer_phone,
  COUNT(*) as total_orders,
  SUM(total_amount) as total_spent,
  FLOOR(SUM(total_amount)) as loyalty_points,
  MAX(created_at) as last_order_date
FROM orders 
WHERE status IN ('completed', 'delivered')
GROUP BY customer_email, customer_phone, customer_name;

-- Daily sales summary view
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT 
  DATE(created_at) as sale_date,
  COUNT(*) as total_orders,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_value,
  COUNT(CASE WHEN order_type = 'delivery' THEN 1 END) as delivery_orders,
  COUNT(CASE WHEN order_type = 'pickup' THEN 1 END) as pickup_orders
FROM orders 
WHERE status IN ('completed', 'delivered')
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;

-- Popular menu items view
CREATE OR REPLACE VIEW popular_menu_items AS
SELECT 
  item->>'name' as item_name,
  item->>'category' as category,
  COUNT(*) as order_count,
  SUM((item->>'quantity')::integer) as total_quantity,
  SUM((item->>'price')::decimal * (item->>'quantity')::integer) as total_revenue
FROM orders,
LATERAL jsonb_array_elements(items) as item
WHERE status IN ('completed', 'delivered')
GROUP BY item->>'name', item->>'category'
ORDER BY order_count DESC;

-- =====================================================
-- Triggers for Automatic Analytics Updates
-- =====================================================

-- Function to update menu analytics
CREATE OR REPLACE FUNCTION update_menu_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process completed/delivered orders
  IF NEW.status IN ('completed', 'delivered') AND 
     (OLD.status IS NULL OR OLD.status NOT IN ('completed', 'delivered')) THEN
    
    -- Update analytics for each item in the order
    INSERT INTO menu_analytics (item_id, item_name, date, orders_count, revenue)
    SELECT 
      (item->>'id')::integer,
      item->>'name',
      CURRENT_DATE,
      1,
      (item->>'price')::decimal * (item->>'quantity')::integer
    FROM jsonb_array_elements(NEW.items) as item
    ON CONFLICT (item_id, date) 
    DO UPDATE SET 
      orders_count = menu_analytics.orders_count + 1,
      revenue = menu_analytics.revenue + EXCLUDED.revenue;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for menu analytics
DROP TRIGGER IF EXISTS trigger_update_menu_analytics ON orders;
CREATE TRIGGER trigger_update_menu_analytics
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_analytics();

-- =====================================================
-- Sample Data for Testing (Optional)
-- =====================================================

-- Insert sample promotional codes
INSERT INTO promotional_codes (code, discount_type, discount_value, minimum_order_amount, max_uses, valid_until) 
VALUES 
  ('WELCOME10', 'percentage', 10.00, 25.00, 100, NOW() + INTERVAL '30 days'),
  ('SAVE5', 'fixed_amount', 5.00, 20.00, 50, NOW() + INTERVAL '14 days'),
  ('LOYALTY15', 'percentage', 15.00, 50.00, 200, NOW() + INTERVAL '60 days')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Database Maintenance Functions
-- =====================================================

-- Function to clean old tracking events (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_tracking_events()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM order_tracking_events 
  WHERE event_timestamp < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh customer profiles (if using the table)
CREATE OR REPLACE FUNCTION refresh_customer_profiles()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  INSERT INTO customer_profiles (email, phone, name, total_orders, total_spent, loyalty_points, tier, updated_at)
  SELECT 
    customer_identifier,
    customer_phone,
    customer_name,
    total_orders,
    total_spent,
    loyalty_points,
    loyalty_tier,
    NOW()
  FROM customer_loyalty_summary
  ON CONFLICT (email) 
  DO UPDATE SET
    total_orders = EXCLUDED.total_orders,
    total_spent = EXCLUDED.total_spent,
    loyalty_points = EXCLUDED.loyalty_points,
    tier = EXCLUDED.tier,
    updated_at = NOW();
    
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Grant Permissions (adjust as needed)
-- =====================================================

-- Grant permissions to service role
GRANT ALL ON loyalty_redemptions TO service_role;
GRANT ALL ON customer_profiles TO service_role;
GRANT ALL ON menu_analytics TO service_role;
GRANT ALL ON promotional_codes TO service_role;
GRANT ALL ON order_tracking_events TO service_role;

-- Grant permissions to authenticated users (read-only for some tables)
GRANT SELECT ON customer_loyalty_summary TO authenticated;
GRANT SELECT ON daily_sales_summary TO authenticated;
GRANT SELECT ON popular_menu_items TO authenticated;

-- =====================================================
-- Performance Monitoring Queries
-- =====================================================

-- Query to check table sizes
/*
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE schemaname = 'public' 
  AND tablename IN ('orders', 'loyalty_redemptions', 'menu_analytics')
ORDER BY tablename, attname;
*/

-- Query to check index usage
/*
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE schemaname = 'public' 
ORDER BY tablename, attname;
*/

COMMENT ON TABLE loyalty_redemptions IS 'Tracks customer loyalty point redemptions';
COMMENT ON TABLE customer_profiles IS 'Consolidated customer profiles with loyalty information';
COMMENT ON TABLE menu_analytics IS 'Daily analytics for menu item performance';
COMMENT ON TABLE promotional_codes IS 'Promotional discount codes and their usage';
COMMENT ON TABLE order_tracking_events IS 'Detailed order status change tracking';

-- End of database improvements script b 