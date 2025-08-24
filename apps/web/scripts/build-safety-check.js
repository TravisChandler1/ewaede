#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 Running build safety checks...');

const checks = [];

// Check 1: Verify Node.js version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion >= 18) {
    checks.push({ name: 'Node.js Version', status: '✅', details: `v${majorVersion} (Required: >=18)` });
  } else {
    checks.push({ name: 'Node.js Version', status: '❌', details: `v${majorVersion} (Required: >=18)` });
  }
} catch (error) {
  checks.push({ name: 'Node.js Version', status: '❌', details: `Error: ${error.message}` });
}

// Check 2: Verify npm version
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  checks.push({ name: 'npm Version', status: '✅', details: `v${npmVersion}` });
} catch (error) {
  checks.push({ name: 'npm Version', status: '❌', details: `Error: ${error.message}` });
}

// Check 3: Verify package.json exists
const packageJsonPath = join(process.cwd(), 'package.json');
if (existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    checks.push({ name: 'package.json', status: '✅', details: `Valid JSON, ${Object.keys(packageJson.dependencies || {}).length} dependencies` });
  } catch (error) {
    checks.push({ name: 'package.json', status: '❌', details: `Invalid JSON: ${error.message}` });
  }
} else {
  checks.push({ name: 'package.json', status: '❌', details: 'File not found' });
}

// Check 4: Verify critical dependencies
const criticalDeps = ['react', 'react-dom', 'react-router', 'vite'];
criticalDeps.forEach(dep => {
  const depPath = join(process.cwd(), 'node_modules', dep);
  if (existsSync(depPath)) {
    checks.push({ name: `Dependency: ${dep}`, status: '✅', details: 'Installed' });
  } else {
    checks.push({ name: `Dependency: ${dep}`, status: '❌', details: 'Not installed' });
  }
});

// Check 5: Verify build scripts
try {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const scripts = packageJson.scripts || {};
  const requiredScripts = ['build', 'dev'];
  
  requiredScripts.forEach(script => {
    if (scripts[script]) {
      checks.push({ name: `Script: ${script}`, status: '✅', details: 'Available' });
    } else {
      checks.push({ name: `Script: ${script}`, status: '❌', details: 'Missing' });
    }
  });
} catch (error) {
  checks.push({ name: 'Build Scripts', status: '❌', details: `Error: ${error.message}` });
}

// Check 6: Verify rollup binaries
const rollupBinaries = [
  '@rollup/rollup-linux-x64-gnu',
  '@rollup/rollup-darwin-x64',
  '@rollup/rollup-win32-x64-msvc'
];

rollupBinaries.forEach(binary => {
  const binaryPath = join(process.cwd(), 'node_modules', binary);
  if (existsSync(binaryPath)) {
    checks.push({ name: `Rollup Binary: ${binary}`, status: '⚠️', details: 'Found (may cause issues)' });
  } else {
    checks.push({ name: `Rollup Binary: ${binary}`, status: '✅', details: 'Not found (good)' });
  }
});

// Check 7: Verify pure rollup
const rollupPath = join(process.cwd(), 'node_modules', 'rollup');
if (existsSync(rollupPath)) {
  checks.push({ name: 'Pure Rollup', status: '✅', details: 'Installed' });
} else {
  checks.push({ name: 'Pure Rollup', status: '❌', details: 'Not installed' });
}

// Display results
console.log('\n📊 Build Safety Check Results:');
console.log('=' .repeat(60));

checks.forEach(check => {
  console.log(`${check.status} ${check.name}: ${check.details}`);
});

// Summary
const passed = checks.filter(c => c.status === '✅').length;
const warnings = checks.filter(c => c.status === '⚠️').length;
const failed = checks.filter(c => c.status === '❌').length;

console.log('\n📈 Summary:');
console.log(`✅ Passed: ${passed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log(`❌ Failed: ${failed}`);

if (failed > 0) {
  console.log('\n🚨 Critical issues detected! Build may fail.');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  Warnings detected but build should proceed.');
} else {
  console.log('\n🎉 All checks passed! Build should succeed.');
}

console.log('\n🔍 Safety check completed.');
