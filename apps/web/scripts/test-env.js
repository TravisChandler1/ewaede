import { config } from 'dotenv';
import { readFileSync, existsSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

console.log('🔍 Testing Environment Variables...\n');

// Check required environment variables
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'DATABASE_URL'
];

let allGood = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    allGood = false;
  }
});

// Check optional variables
const optionalVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'AUTH_SECRET',
  'AUTH_URL'
];

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`⚠️  ${varName}: Not set (optional)`);
  }
});

console.log('\n🔧 Environment File Status:');
try {
  const envPath = join(__dirname, '..', '.env');
  if (existsSync(envPath)) {
    const stats = statSync(envPath);
    console.log(`✅ .env file exists (${stats.size} bytes)`);
  } else {
    console.log('❌ .env file does not exist');
    allGood = false;
  }
} catch (error) {
  console.log('❌ Error checking .env file:', error.message);
  allGood = false;
}

console.log('\n📊 Summary:');
if (allGood) {
  console.log('🎉 All required environment variables are set!');
  console.log('🚀 You can now run the database setup and start the application.');
} else {
  console.log('❌ Some required environment variables are missing.');
  console.log('📖 Please check the DATABASE_SETUP_GUIDE.md for instructions.');
}

console.log('\n💡 Next Steps:');
if (allGood) {
  console.log('1. Run: node scripts/setup-database.js');
  console.log('2. Start the app: npm run dev');
  console.log('3. Test authentication');
} else {
  console.log('1. Update your .env file with Supabase credentials');
  console.log('2. Restart your terminal/IDE');
  console.log('3. Run this test again');
}
