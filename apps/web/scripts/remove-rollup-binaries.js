#!/usr/bin/env node

import { rmSync, existsSync } from 'fs';
import { join } from 'path';

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

console.log('✅ Rollup binary cleanup completed!');
