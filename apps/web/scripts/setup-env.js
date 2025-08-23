#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash, randomBytes } from 'crypto';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Ewa Ede Environment Setup (Supabase)');
console.log('=========================================\n');

// Generate a secure AUTH_SECRET
function generateAuthSecret() {
  return randomBytes(32).toString('base64');
}

// Prompt for user input
function prompt(question) {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      readline.close();
      resolve(answer);
    });
  });
}

async function setupEnvironment() {
  console.log('This script will help you set up your environment variables for Supabase.\n');

  try {
    // Check if .env.local already exists
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      console.log('⚠️  .env.local already exists!');
      const overwrite = await prompt('Do you want to overwrite it? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        process.exit(0);
      }
    }

    // Collect environment variables
    console.log('Please provide the following information:\n');

    console.log('📊 Supabase Database Configuration:');
    console.log('1. Go to https://app.supabase.com');
    console.log('2. Create a new project or select existing one');
    console.log('3. Go to Settings → Database');
    console.log('4. Copy the "Connection string" (URI format)\n');

    const databaseUrl = await prompt('Supabase Database URL (postgresql://postgres:...): ');
    if (!databaseUrl.trim()) {
      console.log('❌ Database URL is required!');
      process.exit(1);
    }

    // Validate Supabase URL format
    if (!databaseUrl.includes('supabase.co') && !databaseUrl.includes('localhost')) {
      console.log('⚠️  This doesn\'t look like a Supabase URL. Make sure it\'s correct.');
    }

    const authUrl = await prompt('Auth URL (your app domain, e.g., https://your-app.vercel.app): ');
    if (!authUrl.trim()) {
      console.log('❌ Auth URL is required!');
      process.exit(1);
    }

    // Generate AUTH_SECRET
    const authSecret = generateAuthSecret();
    console.log('✅ Generated secure AUTH_SECRET');

    // Optional Supabase configuration
    console.log('\nOptional Supabase configuration (press Enter to skip):');
    const supabaseUrl = await prompt('Supabase Project URL (https://[ref].supabase.co): ');
    const supabaseAnonKey = await prompt('Supabase Anon Key: ');
    const supabaseServiceKey = await prompt('Supabase Service Role Key (for admin operations): ');

    // Optional email configuration
    console.log('\nOptional email configuration (press Enter to skip):');
    const smtpHost = await prompt('SMTP Host (e.g., smtp.gmail.com): ');
    const smtpUser = await prompt('SMTP User (your email): ');
    const smtpPass = await prompt('SMTP Password (app password): ');

    // Create .env.local content
    let envContent = `# Ewa Ede Environment Configuration (Supabase)
# Generated on ${new Date().toISOString()}

# Supabase Database Configuration
DATABASE_URL="${databaseUrl}"

# Authentication Configuration
AUTH_SECRET="${authSecret}"
AUTH_URL="${authUrl}"

# Node Environment
NODE_ENV="production"
`;

    // Add optional Supabase configuration
    if (supabaseUrl.trim()) {
      envContent += `
# Supabase Configuration
SUPABASE_URL="${supabaseUrl}"
`;
      if (supabaseAnonKey.trim()) {
        envContent += `SUPABASE_ANON_KEY="${supabaseAnonKey}"
`;
      }
      if (supabaseServiceKey.trim()) {
        envContent += `SUPABASE_SERVICE_ROLE_KEY="${supabaseServiceKey}"
`;
      }
    }

    // Add email configuration if provided
    if (smtpHost.trim()) {
      envContent += `
# Email Configuration
SMTP_HOST="${smtpHost}"
SMTP_PORT="587"
SMTP_USER="${smtpUser}"
SMTP_PASS="${smtpPass}"
`;
    }

    // Add optional configurations
    envContent += `
# Optional: File Upload Configuration
UPLOAD_MAX_SIZE="10485760"
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,application/pdf"

# Optional: Rate Limiting
RATE_LIMIT_REQUESTS="100"
RATE_LIMIT_WINDOW="900000"
`;

    // Write .env.local file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Environment configuration created successfully!');
    console.log(`📁 File saved to: ${envPath}`);
    
    console.log('\n🔐 Security Notes:');
    console.log('- Never commit .env.local to version control');
    console.log('- Keep your AUTH_SECRET secure');
    console.log('- Use strong database passwords');
    console.log('- Store service role key securely (high privileges)');

    console.log('\n📊 Supabase Features Available:');
    console.log('- PostgreSQL database with real-time subscriptions');
    console.log('- Built-in authentication (if configured)');
    console.log('- File storage with CDN');
    console.log('- Edge functions');
    console.log('- Visual dashboard and monitoring');

    console.log('\n🚀 Next Steps:');
    console.log('1. Initialize your database: npm run db:init');
    console.log('2. Test locally: npm run dev');
    console.log('3. Deploy to Vercel: npm run deploy');
    console.log('4. Monitor in Supabase Dashboard: https://app.supabase.com');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupEnvironment();