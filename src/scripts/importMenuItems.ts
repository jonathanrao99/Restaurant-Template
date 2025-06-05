import { supabase } from '@/integrations/supabase/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parse/sync';

const importMenuItems = async () => {
  try {
    // Read the CSV file
    const csvFilePath = path.join(process.cwd(), 'public', 'menu_items_cleaned.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    // Parse CSV content
    const records = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`Found ${records.length} items to import`);

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('menu_items')
      .insert(records);

    if (error) {
      console.error('Error importing data:', error);
      return;
    }

    console.log('Successfully imported menu items:', data);
  } catch (err) {
    console.error('Error:', err);
  }
};

// Run the import
importMenuItems(); 