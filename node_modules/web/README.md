# Ewa Ede - Yoruba Learning Platform

A comprehensive Yoruba language learning platform with admin dashboard, teacher approval system, and interactive learning features. Built with React Router 7 and Supabase.

## 🚀 Quick Deployment to Vercel

### Prerequisites
- [Vercel Account](https://vercel.com)
- [Supabase Account](https://supabase.com)

### 1. Set Up Supabase Database
1. Create a new project in [Supabase Dashboard](https://app.supabase.com)
2. Go to Settings → Database
3. Copy your connection string (URI format)

### 2. Environment Setup
```bash
# Run the interactive setup script
npm run setup
```

### 3. Initialize Database
```bash
# Initialize database with all tables and sample data
npm run db:init
```

### 4. Deploy
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy to Vercel
npm run deploy
```

## 🎯 Features

### For Students
- ✅ **Interactive Dashboard** - Track learning progress
- ✅ **Study Groups** - Join and create study groups
- ✅ **Live Sessions** - Attend teacher-led sessions
- ✅ **Book Clubs** - Participate in reading discussions
- ✅ **E-Library** - Access learning resources
- ✅ **Progress Tracking** - Monitor course completion

### For Teachers
- ✅ **Application System** - Apply to become a teacher
- ✅ **Session Management** - Create and manage live sessions
- ✅ **Student Analytics** - Track student progress
- ✅ **Group Management** - Manage study groups
- ✅ **Content Creation** - Upload and manage resources

### For Administrators
- ✅ **Teacher Approval** - Review and approve teacher applications
- ✅ **User Management** - Manage all platform users
- ✅ **Content Moderation** - Handle reports and content issues
- ✅ **Platform Analytics** - Monitor platform performance
- ✅ **System Settings** - Configure platform features

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
npm run setup

# Initialize database
npm run db:init

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run setup` - Interactive environment setup
- `npm run db:init` - Initialize complete database
- `npm run deploy` - Deploy to Vercel with checks
- `npm run typecheck` - Run TypeScript checks

## 🔐 Default Admin Access

After database initialization:
- **Email:** `admin@ewaede.com`
- **Role:** `admin`
- **Access:** Visit `/admin` on your deployed app

## 📊 Database Schema

The platform includes comprehensive database schema with:
- User profiles and authentication
- Course and lesson management
- Study groups and memberships
- Live sessions and registrations
- Book clubs and discussions
- Teacher applications and approvals
- Admin features and audit logs
- Payment and subscription tracking

## 🌐 Tech Stack

- **Frontend:** React Router 7, TailwindCSS, Lucide Icons
- **Backend:** Hono.js, React Router Server
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Auth.js
- **Deployment:** Vercel
- **UI Components:** Custom components with Tailwind

## 📊 Supabase Features

### Database
- **PostgreSQL** - Full SQL database with ACID compliance
- **Real-time** - Live updates and subscriptions
- **Connection Pooling** - Automatic connection management
- **Backups** - Automated daily backups

### Additional Features
- **Authentication** - Built-in auth with OAuth providers
- **Storage** - File storage with CDN
- **Edge Functions** - Serverless functions
- **Dashboard** - Visual database management
- **Monitoring** - Real-time performance metrics

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `AUTH_SECRET` - Secret key for authentication
- `AUTH_URL` - Your app's URL
- `SUPABASE_URL` - Supabase project URL (optional)
- `SUPABASE_ANON_KEY` - Supabase anonymous key (optional)
- `SMTP_*` - Email configuration (optional)

### Supabase Configuration
```env
# Required
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Optional (for additional Supabase features)
SUPABASE_URL="https://[REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## 📈 Monitoring

### Supabase Dashboard
- Real-time database monitoring
- Query performance analysis
- Usage statistics and limits
- Error tracking and logs

### Vercel Integration
- Automatic performance monitoring
- Error tracking and logging
- Real-time deployment status

## 🔒 Security Features

- Secure authentication with Auth.js
- Role-based access control
- SQL injection prevention with parameterized queries
- XSS protection
- CSRF protection
- Secure password hashing
- SSL/TLS encryption (Supabase default)

## 🌍 Internationalization

The platform is designed with internationalization in mind:
- English interface with Yoruba content
- Extensible for multiple languages
- Cultural context preservation

## 📚 Learning Resources

The platform supports various content types:
- Text-based lessons
- Audio pronunciation guides
- Video tutorials
- Interactive exercises
- Cultural context materials

## 🤝 Community Features

- Study groups for collaborative learning
- Book clubs for literature discussion
- Live sessions for real-time interaction
- Teacher-student communication
- Peer-to-peer learning support

## 🚀 Deployment Options

### Vercel (Recommended)
- Serverless functions
- Global CDN
- Automatic scaling
- Easy GitHub integration

### Supabase Edge Functions
- Run custom logic close to users
- TypeScript/JavaScript support
- Integrated with Supabase services

## 📞 Support

For deployment issues:
1. Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md)
2. Review [Supabase Documentation](https://supabase.com/docs)
3. Review [Vercel Documentation](https://vercel.com/docs)
4. Check application logs for errors

## 🎉 Success!

Once deployed, your Ewa Ede platform will be ready to help users learn Yoruba language and culture!

Visit your deployed app and start exploring the features:
- Sign up as a student
- Apply to become a teacher
- Access the admin dashboard
- Create study groups and sessions

## 🔄 Migration from Other Databases

If you're migrating from another database:

1. **From Neon:** Update `DATABASE_URL` to Supabase connection string
2. **From PostgreSQL:** Export/import your data to Supabase
3. **From MySQL:** Use Supabase migration tools

The application code remains the same - just update the connection string!

## 🌟 Why Supabase?

- **Open Source** - Full control and transparency
- **Real-time** - Built-in real-time subscriptions
- **Scalable** - Automatic scaling based on usage
- **Developer Experience** - Excellent tooling and dashboard
- **Cost Effective** - Generous free tier and reasonable pricing
- **Full Stack** - Database, auth, storage, and functions in one platform