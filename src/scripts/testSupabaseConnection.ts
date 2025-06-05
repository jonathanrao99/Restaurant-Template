import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test inserting a record
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123-456-7890',
      message: 'This is a test message',
      event_type: 'general',
      subscribe_newsletter: true,
      created_at: new Date().toISOString()
    };
    
    console.log('Inserting test data...');
    const { data: insertData, error: insertError } = await supabase
      .from('contact_submissions')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.error('Error inserting data:', insertError);
      return;
    }
    
    console.log('Data inserted successfully:', insertData);
    
    // Test retrieving records
    console.log('Retrieving records...');
    const { data: retrieveData, error: retrieveError } = await supabase
      .from('contact_submissions')
      .select('*')
      .limit(5);
    
    if (retrieveError) {
      console.error('Error retrieving data:', retrieveError);
      return;
    }
    
    console.log('Data retrieved successfully:', retrieveData);
    console.log('Supabase connection test completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
testSupabaseConnection(); 