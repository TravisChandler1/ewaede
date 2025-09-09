# Ẹwà Èdè Yorùbá Academy

A modern, comprehensive e-learning platform for Yoruba language education built with Next.js 15, TypeScript, and Tailwind CSS.

## 🌟 Features

### For Students
- **Interactive Dashboard**: Tab-based navigation with progress tracking
- **Course Enrollment**: Browse and enroll in Yoruba language courses
- **Live Sessions**: Join scheduled live classes with teachers
- **Progress Tracking**: Monitor learning progress and achievements
- **Mobile Responsive**: Optimized for all devices

### For Teachers
- **Course Management**: Create and manage courses and modules
- **Session Scheduling**: Schedule live sessions and manage attendees
- **Student Progress**: Track student enrollment and completion
- **Content Upload**: Upload course materials and resources
- **Dashboard Analytics**: View teaching statistics and performance

### For Administrators
- **User Management**: Approve teacher applications and manage users
- **Content Moderation**: Review and manage uploaded content
- **Analytics Dashboard**: Monitor platform usage and performance
- **System Configuration**: Manage platform settings and policies

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: Supabase Storage
- **UI Components**: Radix UI + Custom Components
- **Icons**: Lucide React
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Supabase account (for file storage)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/yoruba-academy.git
   cd yoruba-academy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file with:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── courses/           # Course pages
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── admin/            # Admin components
│   ├── teacher/          # Teacher components
│   └── auth/             # Authentication components
├── lib/                  # Utility functions
├── types/                # TypeScript types
└── hooks/                # Custom React hooks

prisma/
└── schema.prisma         # Database schema

public/                   # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Create and apply migrations

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## 🔒 Security Features

- **Authentication**: Secure user authentication with NextAuth.js
- **Authorization**: Role-based access control (Student/Teacher/Admin)
- **Security Headers**: XSS protection, CSRF protection
- **Input Validation**: Server-side validation for all forms
- **Password Security**: Strong password requirements with bcrypt

## 📊 Database Schema

The application uses a comprehensive database schema including:

- **Users**: Student, Teacher, and Admin roles
- **Courses**: Modular course structure with lessons
- **Sessions**: Live session scheduling and attendance
- **Progress Tracking**: User progress and achievements
- **File Management**: Content upload and storage
- **Notifications**: In-app notification system

## 🎨 Design System

- **Dark Theme**: Modern dark theme with purple accents
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized images and lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@yorubaacademy.com or join our Discord community.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons by [Lucide](https://lucide.dev)
- UI components by [Radix UI](https://www.radix-ui.com)
