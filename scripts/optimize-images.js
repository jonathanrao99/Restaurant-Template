/**
 * This script optimizes images using Sharp
 * 
 * Usage:
 * node scripts/optimize-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const OUTPUT_DIR = path.join(__dirname, '../public/optimized');

// Configuration for different image sizes
const SIZES = {
  thumbnail: 150,
  small: 300,
  medium: 600,
  large: 1200
};

// Quality settings for different formats
const QUALITY = {
  jpeg: 80,
  webp: 80,
  avif: 50
};

// Function to ensure directory exists
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Function to optimize a single image
async function optimizeImage(filePath) {
  const filename = path.basename(filePath);
  const ext = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, ext);
  
  // Skip if not an image
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return;
  }
  
  console.log(`🔄 Processing ${filename}...`);
  
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Create optimized versions in different sizes
    for (const [sizeName, width] of Object.entries(SIZES)) {
      // Skip if original image is smaller than target size
      if (metadata.width <= width) {
        continue;
      }
      
      const outputDir = path.join(OUTPUT_DIR, sizeName);
      ensureDirectoryExists(outputDir);
      
      // Generate WebP version
      await image
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY.webp })
        .toFile(path.join(outputDir, `${baseName}.webp`));
      
      // Generate AVIF version
      await image
        .resize(width, null, { withoutEnlargement: true })
        .avif({ quality: QUALITY.avif })
        .toFile(path.join(outputDir, `${baseName}.avif`));
      
      // Generate JPEG version
      await image
        .resize(width, null, { withoutEnlargement: true })
        .jpeg({ quality: QUALITY.jpeg })
        .toFile(path.join(outputDir, `${baseName}.jpg`));
    }
    
    console.log(`✅ Optimized ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to optimize ${filename}: ${error.message}`);
  }
}

// Function to process directory recursively
async function processDirectory(directory) {
  const items = fs.readdirSync(directory);
  
  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Skip the optimized directory
      if (item === 'optimized') {
        continue;
      }
      // Process subdirectory
      await processDirectory(itemPath);
    } else if (stat.isFile()) {
      await optimizeImage(itemPath);
    }
  }
}

// Main function
async function main() {
  console.log('🚀 Starting image optimization...');
  ensureDirectoryExists(OUTPUT_DIR);
  await processDirectory(PUBLIC_DIR);
  console.log('✨ Image optimization complete!');
}

main().catch(console.error); 