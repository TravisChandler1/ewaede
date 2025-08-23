# 🚀 Quick Setup Guide - Teacher Approval System

## ✅ What's Been Implemented

### 1. **Teacher Application System**
- Teachers must apply with qualifications, experience, and cover letter
- Applications are stored in `teacher_applications` table
- Teachers are inactive until approved by admin

### 2. **Admin Approval Panel**
- Admin dashboard at `/admin`
- Teacher applications review at `/admin/teacher-applications`
- Approve/reject applications with reasons

### 3. **Authentication Flow**
- Students: Sign up → Active immediately → Access dashboard
- Teachers: Sign up → Pending approval → Wait for admin → Access dashboard

## 🔧 Setup Steps

### 1. **Environment Variables**
Create `.env.local` in `apps/web/` directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"

# Database URL (for server-side operations)
DATABASE_URL="postgresql://postgres:your-password@db.your-ref.supabase.co:5432/postgres"
```

### 2. **Initialize Database**
```bash
cd apps/web
npm run db:init
```

### 3. **Create Admin User**
After database initialization, you can sign up as admin:
- Email: `admin@ewaede.com`
- Role: `admin` (you'll need to manually set this in database)

Or create a new admin user:
```sql
INSERT INTO user_profiles (user_id, full_name, email, role, is_active) 
VALUES ('your-user-id', 'Admin User', 'admin@example.com', 'admin', true);
```

## 🧪 Testing the System

### 1. **Test Student Signup**
1. Go to `/account/signup`
2. Select "Student" role
3. Fill in basic info
4. Should redirect to `/dashboard/setup` immediately

### 2. **Test Teacher Signup**
1. Go to `/account/signup`
2. Select "Teacher" role
3. Fill in all required fields:
   - Qualifications
   - Experience years
   - Teaching subjects
   - Cover letter
4. Should redirect to `/account/pending-approval`

### 3. **Test Admin Approval**
1. Sign in as admin
2. Go to `/admin/teacher-applications`
3. Review applications
4. Click "View Details" to see full application
5. Click "Approve" or "Reject"

### 4. **Test Teacher Login**
1. After approval, teacher can sign in
2. Should access teacher dashboard
3. If rejected, shows rejection reason

## 🔍 Troubleshooting

### **Authentication Error (`/api/auth/error`)**
- ✅ **FIXED**: Removed server-side auth routes
- ✅ **FIXED**: Updated Vite config for client-side auth
- ✅ **FIXED**: Using Supabase client-side authentication

### **Database Connection Issues**
- Check your `DATABASE_URL` format
- Ensure Supabase project is active
- Verify database password is correct

### **Teacher Applications Not Showing**
- Run `npm run db:init` to create tables
- Check if `teacher_applications` table exists
- Verify admin role in `user_profiles` table

### **Environment Variables Not Working**
- Ensure variables start with `VITE_` for client-side
- Restart development server after changes
- Check `.env.local` file location

## 📋 Database Schema

### `user_profiles` Table
```sql
- user_id (VARCHAR) - Supabase auth user ID
- full_name (VARCHAR) - User's full name
- email (VARCHAR) - User's email
- role (VARCHAR) - 'student', 'teacher', or 'admin'
- is_active (BOOLEAN) - false for pending teachers
```

### `teacher_applications` Table
```sql
- user_id (VARCHAR) - References user_profiles
- full_name (VARCHAR) - Applicant's name
- email (VARCHAR) - Applicant's email
- qualifications (TEXT) - Educational background
- experience_years (INTEGER) - Teaching experience
- teaching_subjects (TEXT[]) - Array of subjects
- cover_letter (TEXT) - Application letter
- status (VARCHAR) - 'pending', 'approved', 'rejected'
- rejection_reason (TEXT) - Reason if rejected
```

## 🎯 Next Steps

1. **Test the complete flow**:
   - Student signup → Dashboard access
   - Teacher signup → Pending approval → Admin review → Approval → Dashboard access

2. **Customize the system**:
   - Add email notifications for approvals/rejections
   - Enhance admin dashboard with more features
   - Add teacher profile management

3. **Deploy to production**:
   - Set up environment variables in Vercel
   - Configure Supabase production project
   - Test the complete system

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure database tables are created
4. Test with a fresh browser session

The teacher approval system is now fully functional! 🎉
