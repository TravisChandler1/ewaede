# Supabase Authentication Setup Guide

## 🚀 Quick Setup Steps

### 1. Get Your Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project (or create one if you haven't)
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 2. Create Environment File

Create a `.env.local` file in the `apps/web/` directory:

```bash
# Copy the example file
cp env.example .env.local
```

Then edit `.env.local` with your actual values:

```env
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"

# Database URL (for server-side operations)
DATABASE_URL="postgresql://postgres:your-password@db.your-ref.supabase.co:5432/postgres"
```

### 3. Initialize Your Database

Run the database initialization script:

```bash
cd apps/web
npm run db:init
```

This will:
- Create all necessary tables
- Set up user profiles
- Insert sample data
- Configure authentication

### 4. Test Authentication

1. Start your development server: `npm run dev`
2. Go to `/account/signup` to create a new account
3. Try signing in at `/account/signin`
4. Check if you can access `/dashboard`

## 🔧 How It Works

### Authentication Flow
1. **Sign Up**: Creates Supabase auth user + database profile
2. **Sign In**: Authenticates with Supabase + fetches profile
3. **Session Management**: Automatic token refresh + persistence
4. **Profile Data**: Stored in your `user_profiles` table

### Database Schema
- `user_profiles` table stores additional user information
- `role` field determines access levels (student, teacher, admin)
- `is_active` field controls account status

## 🚨 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure `.env.local` exists and has correct values
   - Check that variables start with `VITE_`

2. **"Invalid API key"**
   - Verify your anon key is correct
   - Make sure you're using the anon key, not service role key

3. **"Database connection failed"**
   - Check your `DATABASE_URL` format
   - Ensure database password is correct
   - Verify SSL is enabled (should be automatic)

4. **"User profile not found"**
   - Run `npm run db:init` to create tables
   - Check if `user_profiles` table exists

### Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public API key for client | `eyJhbGciOiJIUzI1NiIs...` |
| `DATABASE_URL` | Direct database connection | `postgresql://postgres:pass@db.abc123.supabase.co:5432/postgres` |

## 🎯 Next Steps

After setup:
1. **Test user registration** and login
2. **Create admin user** if needed
3. **Set up Row Level Security** policies
4. **Configure email templates** for auth emails
5. **Add OAuth providers** (Google, GitHub, etc.)

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
