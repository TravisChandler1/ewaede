#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Ewa Ede Deployment Script');
console.log('============================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create .env.local with the following variables:');
  console.log('- DATABASE_URL');
  console.log('- AUTH_SECRET');
  console.log('- AUTH_URL');
  console.log('\nSee .env.example for reference.');
  process.exit(1);
}

try {
  // Step 1: Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Step 2: Run type checking
  console.log('\n🔍 Running type checks...');
  execSync('npm run typecheck', { stdio: 'inherit' });

  // Step 3: Build the application
  console.log('\n🏗️  Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 4: Deploy to Vercel
  console.log('\n🚀 Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });

  console.log('\n✅ Deployment completed successfully!');
  console.log('\n🎉 Your Ewa Ede platform is now live!');
  console.log('\nNext steps:');
  console.log('1. Visit your deployed app');
  console.log('2. Test user registration and login');
  console.log('3. Access admin panel at /admin');
  console.log('4. Set up your custom domain (optional)');

} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  console.log('\nTroubleshooting tips:');
  console.log('1. Check your environment variables');
  console.log('2. Ensure your database is accessible');
  console.log('3. Verify your Vercel account is set up');
  console.log('4. Check the build logs for specific errors');
  process.exit(1);
}