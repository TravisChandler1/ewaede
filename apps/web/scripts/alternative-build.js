#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting alternative build process...');

try {
  // Step 1: Clean install without optional dependencies
  console.log('📦 Installing dependencies without optional packages...');
  execSync('npm ci --prefer-offline --no-audit --omit=optional', { stdio: 'inherit' });
  
  // Step 2: Remove problematic rollup binaries completely
  console.log('🧹 Removing problematic rollup binaries...');
  const rollupBinaries = [
    '@rollup/rollup-linux-x64-gnu',
    '@rollup/rollup-darwin-x64',
    '@rollup/rollup-win32-x64-msvc',
    '@rollup/rollup-linux-x64-musl',
    '@rollup/rollup-linux-arm64-gnu',
    '@rollup/rollup-linux-arm64-musl',
    '@rollup/rollup-darwin-arm64',
    '@rollup/rollup-win32-arm64-msvc'
  ];
  
  rollupBinaries.forEach(binary => {
    const binaryPath = join(process.cwd(), 'node_modules', binary);
    if (existsSync(binaryPath)) {
      try {
        rmSync(binaryPath, { recursive: true, force: true });
        console.log(`✅ Removed ${binary}`);
      } catch (error) {
        console.log(`⚠️  Could not remove ${binary}: ${error.message}`);
      }
    }
  });
  
  // Step 3: Force install pure JavaScript rollup
  console.log('🔧 Installing pure JavaScript rollup...');
  execSync('npm install rollup@^4.0.0 --no-optional --force', { stdio: 'inherit' });
  
  // Step 4: Try to use Vite directly instead of React Router build
  console.log('🏗️  Attempting Vite build...');
  try {
    execSync('npx vite build', { stdio: 'inherit' });
    console.log('✅ Vite build completed successfully!');
  } catch (viteError) {
    console.log('⚠️  Vite build failed, trying React Router with overrides...');
    
    // Step 5: Create aggressive rollup overrides
    console.log('⚙️  Creating aggressive rollup overrides...');
    
    // Override the problematic native.js file
    const nativeOverride = `
// Override the problematic native.js file
const rollup = require('rollup');

// Export the pure JavaScript rollup instead of native
module.exports = rollup;
module.exports.requireWithFriendlyError = (id) => {
  if (id.includes('@rollup/rollup-')) {
    return rollup;
  }
  return require(id);
};
`;
    
    const rollupDir = join(process.cwd(), 'node_modules', 'rollup', 'dist');
    if (existsSync(rollupDir)) {
      const nativePath = join(rollupDir, 'native.js');
      if (existsSync(nativePath)) {
        // Backup the original
        writeFileSync(nativePath + '.backup', require('fs').readFileSync(nativePath, 'utf8'));
        // Replace with our override
        writeFileSync(nativePath, nativeOverride);
        console.log('✅ Created native.js override');
      }
    }
    
    // Step 6: Set environment variables to force pure JavaScript
    process.env.ROLLUP_NATIVE = 'false';
    process.env.ROLLUP_PLATFORM = 'linux';
    process.env.ROLLUP_ARCH = 'x64';
    process.env.NODE_OPTIONS = '--max-old-space-size=4096';
    
    // Step 7: Try React Router build again
    console.log('🏗️  Running React Router build with overrides...');
    execSync('npx react-router build', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
  }
  
  console.log('✅ Alternative build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
