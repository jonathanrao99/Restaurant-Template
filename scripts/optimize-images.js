import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const menuImagesDir = path.join(__dirname, '../public/Menu_Images');
const optimizedDir = path.join(__dirname, '../public/optimized');

// Create optimized directories if they don't exist
const sizes = ['thumbnail', 'small', 'medium', 'large'];
sizes.forEach(size => {
  const sizeDir = path.join(optimizedDir, size);
  if (!fs.existsSync(sizeDir)) {
    fs.mkdirSync(sizeDir, { recursive: true });
  }
});

// Size configurations
const sizeConfigs = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 }
};

async function optimizeImage(imagePath, filename) {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    // Process each size
    for (const [size, config] of Object.entries(sizeConfigs)) {
      const outputDir = path.join(optimizedDir, size);
      
      // Create WebP version
      await image
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 80 })
        .toFile(path.join(outputDir, `${filename}.webp`));
      
      // Create AVIF version
      await image
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center'
        })
        .avif({ quality: 80 })
        .toFile(path.join(outputDir, `${filename}.avif`));
      
      // Create optimized JPEG version
      await image
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80, progressive: true })
        .toFile(path.join(outputDir, `${filename}.jpg`));
    }
    
    console.log(`✅ Optimized: ${filename}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${filename}:`, error.message);
  }
}

async function optimizeAllImages() {
  try {
    const files = fs.readdirSync(menuImagesDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );
    
    console.log(`Found ${imageFiles.length} images to optimize...`);
    
    for (const file of imageFiles) {
      const imagePath = path.join(menuImagesDir, file);
      const filename = path.parse(file).name;
      await optimizeImage(imagePath, filename);
    }
    
    console.log('🎉 Image optimization complete!');
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

optimizeAllImages(); 