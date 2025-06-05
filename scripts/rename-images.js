/**
 * This script renames image files with shorter, more descriptive names
 * 
 * Usage:
 * node scripts/rename-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');

// Function to sanitize filenames
function sanitizeFilename(filename) {
  // Remove special characters and spaces, convert to lowercase
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')        // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');     // Remove leading/trailing hyphens
}

// Function to rename files in a directory
function renameFilesInDirectory(directory) {
  console.log(`Processing directory: ${directory}`);
  
  const items = fs.readdirSync(directory);
  
  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Process subdirectory
      renameFilesInDirectory(itemPath);
    } else if (stat.isFile()) {
      // Check if it's an image
      const ext = path.extname(itemPath).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico'].includes(ext)) {
        const dirName = path.basename(directory);
        const fileName = path.basename(itemPath, ext);
        
        // Create a shorter, descriptive name
        let newFileName;
        
        // Special handling for specific directories
        if (dirName === 'Menu_Images') {
          // For menu images, use a shorter version of the dish name
          newFileName = sanitizeFilename(fileName);
        } else if (dirName === 'Ingredients') {
          // For ingredients, use a simple name
          newFileName = sanitizeFilename(fileName);
        } else if (dirName === 'Truck') {
          // For truck images, use a simple numbering
          if (fileName.startsWith('new')) {
            const num = fileName.match(/\d+/)?.[0] || '';
            newFileName = `truck-${num}`;
          } else {
            newFileName = 'truck-old';
          }
        } else {
          // For other images, use a simple name
          newFileName = sanitizeFilename(fileName);
        }
        
        // Add the extension back
        const newFilePath = path.join(directory, `${newFileName}${ext}`);
        
        // Skip if the new filename is the same as the old one
        if (itemPath === newFilePath) {
          console.log(`⏭️ Skipping ${itemPath} (name already optimized)`);
          continue;
        }
        
        // Skip if the new file already exists
        if (fs.existsSync(newFilePath)) {
          console.log(`⚠️ Skipping ${itemPath} (${newFilePath} already exists)`);
          continue;
        }
        
        try {
          console.log(`🔄 Renaming ${itemPath} to ${newFilePath}`);
          fs.renameSync(itemPath, newFilePath);
          console.log(`✅ Renamed ${itemPath} to ${newFilePath}`);
        } catch (error) {
          console.error(`❌ Failed to rename ${itemPath}: ${error.message}`);
        }
      }
    }
  }
}

// Main function
function main() {
  console.log('🚀 Starting image renaming...');
  renameFilesInDirectory(PUBLIC_DIR);
  console.log('✨ Image renaming complete!');
}

main(); 