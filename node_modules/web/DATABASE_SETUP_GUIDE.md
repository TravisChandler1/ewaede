# 🗄️ Database Setup Guide for Ewa Ede Yoruba Academy

## 🚨 **IMPORTANT: Fix the "Authentication not initialized" Error**

The error you're seeing is because the environment variables for Supabase are not properly configured. Follow this guide to fix it.

## 📋 **Prerequisites**

1. **Supabase Account**: You need a Supabase project
2. **Database URL**: Your Supabase PostgreSQL connection string
3. **API Keys**: Your Supabase project's API keys

## 🔧 **Step 1: Configure Environment Variables**

### **1.1 Update your `.env` file**

Open `apps/web/.env` and replace the placeholder values with your actual Supabase credentials:

```bash
# Ewa Ede Environment Configuration (Supabase)

# Supabase Database Configuration
# Get this from your Supabase project settings -> Database -> Connection string
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres"

# Supabase Configuration (Client-side - use VITE_ prefix)
# Get these from your Supabase project settings -> API
VITE_SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
VITE_SUPABASE_ANON_KEY="your-actual-anon-key-here"

# Supabase Service Role Key (Server-side only - don't expose to client)
SUPABASE_SERVICE_ROLE_KEY="your-actual-service-role-key-here"

# Authentication
AUTH_SECRET="your-auth-secret-here"
AUTH_URL="your-app-url-here"

# Optional: For development
NEXT_PUBLIC_CREATE_ENV="DEVELOPMENT"
```

### **1.2 Get Your Supabase Credentials**

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon public key** → `VITE_SUPABASE_ANON_KEY`
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY`

5. Go to **Settings** → **Database**
6. Copy the **Connection string** → `DATABASE_URL`

## 🗄️ **Step 2: Set Up Database Schema**

### **2.1 Run the Database Setup Script**

```bash
cd apps/web
node scripts/setup-database.js
```

This script will:
- ✅ Create all necessary tables
- ✅ Set up relationships and constraints
- ✅ Insert sample data
- ✅ Configure Row Level Security (RLS)

### **2.2 Alternative: Manual SQL Execution**

If the script doesn't work, you can manually run the SQL files in your Supabase SQL editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Run `database/schema.sql` first
3. Then run `database/admin_schema.sql`
4. Finally run `database/sample_data.sql`

## 🔐 **Step 3: Configure Row Level Security (RLS)**

The setup script should handle this, but if you need to manually configure RLS:

1. Go to **Authentication** → **Policies** in Supabase
2. Enable RLS on all tables
3. Create policies for:
   - `user_profiles`: Users can only see their own profile
   - `teacher_applications`: Users can see their own applications, admins can see all
   - `study_groups`: Public groups are visible to all, private groups only to members
   - `courses`: All users can view active courses

## 🧪 **Step 4: Test the Setup**

### **4.1 Test Database Connection**

```bash
cd apps/web
node -e "
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => {
    console.log('✅ Database connection successful!');
    return client.query('SELECT NOW()');
  })
  .then(result => {
    console.log('✅ Database query successful:', result.rows[0]);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  })
  .finally(() => {
    client.end();
  });
"
```

### **4.2 Test Supabase Client**

```bash
cd apps/web
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log('✅ Supabase client created successfully!');
console.log('URL:', process.env.VITE_SUPABASE_URL);
console.log('Key length:', process.env.VITE_SUPABASE_ANON_KEY?.length || 0);
"
```

## 🚀 **Step 5: Deploy to Vercel**

### **5.1 Set Environment Variables on Vercel**

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add these variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### **5.2 Deploy**

```bash
npm run deploy:quick
```

## 🔍 **Troubleshooting**

### **"Authentication not initialized" Error**

**Cause**: Environment variables not loaded or Supabase client not initialized
**Solution**: 
1. Check `.env` file exists and has correct values
2. Ensure environment variables are set on Vercel
3. Verify Supabase project is active

### **"Missing Supabase environment variables" Error**

**Cause**: `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` not set
**Solution**:
1. Check `.env` file
2. Restart development server after changing `.env`
3. Verify variable names start with `VITE_`

### **Database Connection Failed**

**Cause**: Invalid `DATABASE_URL` or database not accessible
**Solution**:
1. Verify `DATABASE_URL` format
2. Check if database is paused (Supabase free tier)
3. Verify IP allowlist if using restrictions

### **"Table already exists" Warnings**

**Normal**: These warnings are expected if you've run the setup before
**Action**: No action needed, the script will skip existing tables

## 📚 **Database Schema Overview**

The database includes these main tables:

- **`user_profiles`**: Extended user information
- **`teacher_applications`**: Teacher approval workflow
- **`courses`**: Learning content
- **`study_groups`**: Group learning features
- **`user_progress`**: Learning progress tracking
- **`live_sessions`**: Live teaching sessions

## 🎯 **Next Steps**

After successful setup:

1. ✅ Test user registration and login
2. ✅ Test teacher application workflow
3. ✅ Test admin dashboard access
4. ✅ Deploy to production
5. ✅ Monitor database performance

## 📞 **Need Help?**

If you encounter issues:

1. Check the error messages carefully
2. Verify all environment variables are set
3. Test database connection separately
4. Check Supabase project status
5. Review the troubleshooting section above

---

**Happy Learning! 🌍📚**
