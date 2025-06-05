import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createContactTable() {
  try {
    // Create the contact_submissions table
    const { error } = await supabase.rpc('create_contact_table');
    
    if (error) {
      console.error('Error creating table:', error);
      return;
    }
    
    console.log('Contact submissions table created successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
createContactTable(); 