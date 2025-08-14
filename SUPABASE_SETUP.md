# Supabase Setup Guide for Ewa Ede Yoruba Academy

This guide will help you configure your application to use Supabase as your database and authentication provider.

## 🚀 Quick Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `ewa-ede-academy`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### 2. Get Your Project Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://[your-project-ref].supabase.co`
   - **Project API Keys**:
     - `anon` `public` key
     - `service_role` `secret` key

3. Go to **Settings** → **Database**
4. Copy the **Connection string** → **URI**

### 3. Update Environment Variables

Replace the placeholders in your `.env` file with your actual Supabase credentials:

```env
# Replace [YOUR-PASSWORD] with your database password
# Replace [YOUR-PROJECT-REF] with your project reference (from the URL)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Replace [YOUR-PROJECT-REF] with your project reference
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
REACT_APP_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"

# Replace [YOUR-ANON-KEY] with your anon public key
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
REACT_APP_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# Replace [YOUR-SERVICE-ROLE-KEY] with your service role key
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# Keep these as they are
REACT_APP_API_URL="http://localhost:3001/api"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Set Up Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Supabase (creates tables)
npm run db:push

# Optional: Seed database with sample data
npm run db:seed
```

### 6. Configure Supabase Authentication

In your Supabase dashboard:

1. Go to **Authentication** → **Settings**
2. Configure **Site URL**: `http://localhost:3000` (for development)
3. Add **Redirect URLs**: 
   - `http://localhost:3000`
   - `http://localhost:3000/auth/callback`
4. **Email Templates**: Customize if needed
5. **Providers**: Email is enabled by default

### 7. Set Up Row Level Security (RLS)

In your Supabase dashboard, go to **Authentication** → **Policies** and enable RLS for your tables:

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Add similar policies for other tables as needed
```

## 🧪 Testing Your Setup

### 1. Start the Development Server

```bash
npm start
```

### 2. Test Authentication

1. Go to `http://localhost:3000`
2. Click "Sign Up" and create a test account
3. Check your email for verification (if email confirmation is enabled)
4. Try logging in with your credentials

### 3. Test Database Connection

1. Go to **Database** → **Table Editor** in Supabase
2. You should see all your tables created by Prisma
3. Check if sample data exists (if you ran the seed script)

### 4. Test the Dashboard

1. Login as a student: `student@ewaedeyoruba.com` / `student123`
2. Login as a teacher: `teacher@ewaedeyoruba.com` / `teacher123`
3. Login as admin: `admin@ewaedeyoruba.com` / `admin123`

## 🔧 Advanced Configuration

### Real-time Subscriptions

Enable real-time features in Supabase:

```javascript
// Example: Listen to changes in groups table
const subscription = supabase
  .channel('groups-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'groups' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

### File Storage

Set up file storage for avatars and resources:

1. Go to **Storage** in Supabase dashboard
2. Create buckets:
   - `avatars` (for user profile pictures)
   - `resources` (for e-library files)
3. Configure bucket policies for access control

### Edge Functions (Optional)

For advanced server-side logic:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize functions
supabase functions new my-function
```

## 🚨 Production Deployment

### Environment Variables for Production

Update your production environment with:

```env
DATABASE_URL="postgresql://postgres:[PROD-PASSWORD]@db.[PROD-PROJECT-REF].supabase.co:5432/postgres"
REACT_APP_SUPABASE_URL="https://[PROD-PROJECT-REF].supabase.co"
REACT_APP_SUPABASE_ANON_KEY="[PROD-ANON-KEY]"
```

### Security Checklist

- [ ] Enable RLS on all tables
- [ ] Configure proper authentication policies
- [ ] Set up proper CORS settings
- [ ] Use environment variables for all secrets
- [ ] Enable email confirmation for production
- [ ] Set up proper backup policies

## 📚 Useful Commands

```bash
# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema changes to database
npm run db:migrate    # Create and run migrations
npm run db:studio     # Open Prisma Studio
npm run db:seed       # Seed database with sample data

# Development
npm start             # Start development server
npm run build         # Build for production
npm test              # Run tests
```

## 🆘 Troubleshooting

### Common Issues

1. **Connection Error**: Check your DATABASE_URL format
2. **Auth Error**: Verify SUPABASE_URL and ANON_KEY
3. **RLS Error**: Make sure Row Level Security policies are set up
4. **CORS Error**: Check Site URL and Redirect URLs in Supabase settings

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://reactjs.org/docs)

## 🎉 You're All Set!

Your Ewa Ede Yoruba Academy is now configured with Supabase! You have:

✅ PostgreSQL database hosted on Supabase  
✅ Authentication system with user management  
✅ Real-time capabilities  
✅ Secure API with Row Level Security  
✅ File storage capabilities  
✅ Production-ready setup  

Start building amazing features for your Yoruba learning platform! 🚀