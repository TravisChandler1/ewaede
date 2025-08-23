# Ewa Ede - Vercel Deployment Guide (Supabase)

This guide will help you deploy your Ewa Ede Yoruba learning platform to Vercel with Supabase Database.

## Prerequisites

- [Vercel Account](https://vercel.com)
- [Supabase Account](https://supabase.com)
- [GitHub Account](https://github.com) (recommended for automatic deployments)

## Step 1: Set Up Supabase Database

1. **Create a Supabase Project:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: "ewa-ede" or similar
   - Set a strong database password
   - Choose a region close to your users
   - Click "Create new project"

2. **Get Your Connection Details:**
   - Go to Settings → Database
   - Copy the "Connection string" (URI format)
   - It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

3. **Initialize Your Database:**
   ```bash
   # Set your DATABASE_URL environment variable
   export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   
   # Initialize the complete database with all features
   npm run db:init
   ```

## Step 2: Prepare for Deployment

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Set Environment Variables:**
   Create a `.env.local` file (don't commit this):
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   AUTH_SECRET="your-random-secret-key"
   AUTH_URL="https://your-app-name.vercel.app"
   ```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. **Build and Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Set Environment Variables in Vercel:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add AUTH_SECRET
   vercel env add AUTH_URL
   ```

### Option B: Deploy via GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment with Supabase"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `DATABASE_URL`: Your Supabase connection string
     - `AUTH_SECRET`: A random secret key (generate with `openssl rand -base64 32`)
     - `AUTH_URL`: Your Vercel app URL (e.g., `https://your-app.vercel.app`)

3. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete

## Step 4: Supabase Configuration

1. **Enable Row Level Security (Optional but Recommended):**
   - Go to Authentication → Policies in Supabase Dashboard
   - Enable RLS for sensitive tables if needed

2. **Set up Supabase Auth (Optional):**
   - If you want to use Supabase Auth instead of Auth.js
   - Configure providers in Authentication → Settings

3. **Configure Storage (Optional):**
   - Set up file storage for user uploads
   - Configure bucket policies

## Step 5: Post-Deployment Setup

1. **Verify Database Connection:**
   - Visit your deployed app
   - Try signing up as a new user
   - Check if data is being saved in Supabase

2. **Set Up Admin Access:**
   - The database initialization creates a default admin user
   - Email: `admin@ewaede.com`
   - Access the admin panel at `/admin`

3. **Test Key Features:**
   - User registration and login
   - Teacher application process
   - Admin dashboard functionality
   - Study groups and sessions

## Step 6: Supabase Dashboard Monitoring

1. **Monitor Database:**
   - Use Supabase Dashboard to monitor queries
   - Check database usage and performance
   - Set up alerts for high usage

2. **Real-time Features (Optional):**
   - Enable real-time subscriptions for live features
   - Configure real-time policies

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | Yes | `postgresql://postgres:pass@db.ref.supabase.co:5432/postgres` |
| `AUTH_SECRET` | Secret key for authentication | Yes | `your-random-secret-key` |
| `AUTH_URL` | Your app's URL | Yes | `https://your-app.vercel.app` |
| `SUPABASE_URL` | Supabase project URL (optional) | No | `https://ref.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key (optional) | No | `your-anon-key` |

## Supabase Advantages

1. **Real-time Subscriptions:**
   - Live updates for chat and notifications
   - Real-time collaboration features

2. **Built-in Authentication:**
   - OAuth providers (Google, GitHub, etc.)
   - Magic links and OTP

3. **File Storage:**
   - Built-in file storage with CDN
   - Image transformations

4. **Edge Functions:**
   - Serverless functions close to users
   - Custom business logic

5. **Dashboard & Monitoring:**
   - Visual query builder
   - Real-time monitoring
   - Performance insights

## Troubleshooting

### Common Issues:

1. **Database Connection Errors:**
   - Verify your `DATABASE_URL` is correct
   - Check if your Supabase project is active
   - Ensure the database password is correct

2. **SSL Connection Issues:**
   - Supabase requires SSL connections
   - Make sure your connection string includes SSL parameters

3. **Build Failures:**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript configuration

4. **Authentication Issues:**
   - Verify `AUTH_SECRET` is set
   - Check `AUTH_URL` matches your domain
   - Ensure cookies are working

### Supabase-Specific Issues:

1. **Row Level Security:**
   - If queries fail, check RLS policies
   - Ensure service role key is used for admin operations

2. **Connection Limits:**
   - Monitor connection usage in Supabase dashboard
   - Consider connection pooling for high traffic

3. **Query Performance:**
   - Use Supabase query analyzer
   - Add indexes for slow queries
   - Monitor query execution time

## Performance Optimization

1. **Database Optimization:**
   - Use Supabase connection pooling
   - Optimize queries with proper indexes
   - Monitor slow queries in dashboard

2. **Vercel Optimization:**
   - Enable Edge Functions for better performance
   - Use Vercel Analytics to monitor performance
   - Optimize images and assets

3. **Supabase Features:**
   - Use Edge Functions for compute-heavy tasks
   - Implement caching strategies
   - Use real-time subscriptions efficiently

## Monitoring and Maintenance

1. **Supabase Dashboard:**
   - Monitor database performance
   - Track API usage and limits
   - Set up usage alerts

2. **Vercel Analytics:**
   - Enable analytics in your Vercel dashboard
   - Monitor page load times and user interactions

3. **Error Tracking:**
   - Check Vercel function logs
   - Monitor Supabase logs
   - Set up error notifications

## Scaling Considerations

1. **Database Scaling:**
   - Supabase automatically scales based on plan
   - Monitor usage and upgrade plan as needed
   - Consider read replicas for high-read workloads

2. **Vercel Scaling:**
   - Vercel automatically scales serverless functions
   - Monitor function execution time
   - Consider upgrading for higher limits

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files to version control
   - Use strong, random secrets
   - Rotate secrets regularly

2. **Database Security:**
   - Use SSL connections (enabled by default)
   - Implement Row Level Security policies
   - Regular security updates

3. **Supabase Security:**
   - Use service role key only on server-side
   - Implement proper RLS policies
   - Monitor authentication logs

## Support

If you encounter issues during deployment:

1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review [Supabase Documentation](https://supabase.com/docs)
3. Check the application logs in Vercel dashboard
4. Monitor database logs in Supabase dashboard

Your Ewa Ede platform should now be successfully deployed with Supabase and ready to help users learn Yoruba! 🎉