#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting Vercel build process...');

try {
  // Step 1: Clean install without optional dependencies
  console.log('📦 Installing dependencies without optional packages...');
  execSync('npm ci --prefer-offline --no-audit --omit=optional', { stdio: 'inherit' });
  
  // Step 2: Force install pure JavaScript rollup
  console.log('🔧 Installing pure JavaScript rollup...');
  execSync('npm install rollup@^4.0.0 --no-optional --force', { stdio: 'inherit' });
  
  // Step 3: Create a rollup override to prevent platform-specific binary issues
  console.log('⚙️  Creating rollup override...');
  const rollupOverride = `
// Force pure JavaScript rollup
const path = require('path');
const rollup = require('rollup');

// Override native rollup to use pure JavaScript version
process.env.ROLLUP_NATIVE = 'false';
process.env.ROLLUP_PLATFORM = 'linux';
process.env.ROLLUP_ARCH = 'x64';

module.exports = rollup;
`;
  
  const overrideDir = join(process.cwd(), 'node_modules', 'rollup-override');
  mkdirSync(overrideDir, { recursive: true });
  writeFileSync(join(overrideDir, 'index.js'), rollupOverride);
  
  // Step 4: Set environment variables to force pure JavaScript
  process.env.ROLLUP_NATIVE = 'false';
  process.env.ROLLUP_PLATFORM = 'linux';
  process.env.ROLLUP_ARCH = 'x64';
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  
  // Step 5: Run the actual build
  console.log('🏗️  Running React Router build...');
  execSync('npx react-router build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('✅ Vercel build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
