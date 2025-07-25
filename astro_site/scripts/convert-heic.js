#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join, parse, extname } from 'path';
import { readdir, stat } from 'fs/promises';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IMAGES_DIR = join(__dirname, '../src/content/notes/images');

async function findHeicFiles(dir) {
  const files = [];
  const entries = await readdir(dir);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      files.push(...await findHeicFiles(fullPath));
    } else if (extname(entry).toLowerCase() === '.heic') {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function convertHeicToWebp() {
  console.log('🔍 Searching for HEIC files in', IMAGES_DIR);
  
  try {
    const heicFiles = await findHeicFiles(IMAGES_DIR);
    
    if (heicFiles.length === 0) {
      console.log('✅ No HEIC files found to convert');
      return;
    }
    
    console.log(`📸 Found ${heicFiles.length} HEIC file(s) to convert`);
    
    for (const heicFile of heicFiles) {
      const parsed = parse(heicFile);
      const webpFile = join(parsed.dir, `${parsed.name}.webp`);
      
      try {
        console.log(`🔄 Converting ${parsed.base} to ${parsed.name}.webp`);
        
        await sharp(heicFile)
          .webp({ quality: 85 })
          .toFile(webpFile);
          
        console.log(`✅ Successfully converted ${parsed.base}`);
      } catch (error) {
        console.error(`❌ Failed to convert ${parsed.base}:`, error.message);
      }
    }
    
    console.log('🎉 HEIC to WebP conversion completed');
  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    process.exit(1);
  }
}

convertHeicToWebp();