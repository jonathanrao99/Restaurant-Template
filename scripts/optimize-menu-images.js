/**
 * Menu Image Optimization Script
 * Compresses and optimizes all menu images to WebP format
 * Reduces file sizes while maintaining quality
 * 
 * Usage: node scripts/optimize-menu-images.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '..', 'public', 'Menu_Images');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'Menu_Images_Optimized');

// Optimization settings
const QUALITY = 85; // Quality for WebP (0-100)
const MAX_WIDTH = 800; // Maximum width in pixels
const MAX_HEIGHT = 800; // Maximum height in pixels

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    await sharp(inputPath)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);

    return {
      original: originalSize,
      optimized: newSize,
      savings: savings,
    };
  } catch (error) {
    console.error(`❌ Error optimizing ${path.basename(inputPath)}:`, error.message);
    return null;
  }
}

async function processAllImages() {
  console.log('🎨 Starting menu image optimization...\n');

  const files = fs.readdirSync(SOURCE_DIR);
  const imageFiles = files.filter(file =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  let totalOriginal = 0;
  let totalOptimized = 0;
  let successCount = 0;
  let errorCount = 0;

  console.log(`Found ${imageFiles.length} images to optimize\n`);

  for (const file of imageFiles) {
    const inputPath = path.join(SOURCE_DIR, file);
    const outputFileName = file.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    process.stdout.write(`Processing ${file}...`);

    const result = await optimizeImage(inputPath, outputPath);

    if (result) {
      totalOriginal += result.original;
      totalOptimized += result.optimized;
      successCount++;

      const originalKB = (result.original / 1024).toFixed(2);
      const optimizedKB = (result.optimized / 1024).toFixed(2);

      console.log(` ✅ ${originalKB}KB → ${optimizedKB}KB (${result.savings}% savings)`);
    } else {
      errorCount++;
      console.log(` ❌ Failed`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully optimized: ${successCount} images`);
  console.log(`❌ Failed: ${errorCount} images`);
  console.log(`📦 Total original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📦 Total optimized size: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Total savings: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)} MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(2)}%)`);
  console.log('='.repeat(60));

  console.log('\n📁 Optimized images saved to:', OUTPUT_DIR);
  console.log('\n⚠️  NEXT STEPS:');
  console.log('1. Review the optimized images in', OUTPUT_DIR);
  console.log('2. If satisfied, backup original Menu_Images folder');
  console.log('3. Replace Menu_Images contents with Menu_Images_Optimized contents');
  console.log('4. Update menuData.ts file extensions from .jpg/.png to .webp');
  console.log('5. Test the website to ensure all images load correctly\n');
}

// Run the optimization
processAllImages().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

