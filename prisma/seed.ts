import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create pricing plans
  const pricingPlans = await Promise.all([
    prisma.pricingPlan.upsert({
      where: { level: 'NOVICE' },
      update: {},
      create: {
        level: 'NOVICE',
        name: 'Novice',
        description: 'Perfect for beginners starting their Yoruba journey',
        monthlyPrice: 29,
        yearlyPrice: 290,
        features: [
          'Basic vocabulary',
          'Simple greetings',
          'Audio pronunciation',
          'Community access'
        ],
        isActive: true,
      },
    }),
    prisma.pricingPlan.upsert({
      where: { level: 'BEGINNER' },
      update: {},
      create: {
        level: 'BEGINNER',
        name: 'Beginner',
        description: 'Build your foundation with essential grammar and phrases',
        monthlyPrice: 49,
        yearlyPrice: 490,
        features: [
          'Grammar basics',
          'Common phrases',
          'Interactive exercises',
          'Group sessions',
          'E-library access'
        ],
        isActive: true,
      },
    }),
    prisma.pricingPlan.upsert({
      where: { level: 'ADVANCED' },
      update: {},
      create: {
        level: 'ADVANCED',
        name: 'Advanced',
        description: 'Master complex grammar and cultural nuances',
        monthlyPrice: 79,
        yearlyPrice: 790,
        features: [
          'Complex grammar',
          'Conversation practice',
          'Cultural context',
          'Book club access',
          'Live sessions'
        ],
        isActive: true,
      },
    }),
    prisma.pricingPlan.upsert({
      where: { level: 'PRO' },
      update: {},
      create: {
        level: 'PRO',
        name: 'Pro',
        description: 'Achieve fluency and teaching certification',
        monthlyPrice: 129,
        yearlyPrice: 1290,
        features: [
          'Fluency training',
          'Literature study',
          'One-on-one sessions',
          'Teaching certification',
          'All features'
        ],
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Created pricing plans');

  // Create sample admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ewaedeyoruba.com' },
    update: {},
    create: {
      email: 'admin@ewaedeyoruba.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user');

  // Create sample teacher
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@ewaedeyoruba.com' },
    update: {},
    create: {
      email: 'teacher@ewaedeyoruba.com',
      password: teacherPassword,
      firstName: 'Adunni',
      lastName: 'Olatunji',
      role: 'TEACHER',
      teacherStatus: 'APPROVED',
    },
  });

  // Create teacher profile
  await prisma.teacherProfile.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      bio: 'Experienced Yoruba language instructor with over 10 years of teaching experience.',
      expertise: ['Grammar', 'Pronunciation', 'Cultural Context', 'Literature'],
      experience: 10,
      rating: 4.8,
      totalStudents: 47,
    },
  });

  console.log('✅ Created teacher user and profile');

  // Create sample student
  const studentPassword = await bcrypt.hash('student123', 10);
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@ewaedeyoruba.com' },
    update: {},
    create: {
      email: 'student@ewaedeyoruba.com',
      password: studentPassword,
      firstName: 'Adebayo',
      lastName: 'Johnson',
      role: 'STUDENT',
      learningLevel: 'BEGINNER',
      teachingType: 'GROUP',
    },
  });

  // Create student progress
  await prisma.progress.upsert({
    where: { 
      userId_level: {
        userId: studentUser.id,
        level: 'BEGINNER'
      }
    },
    update: {},
    create: {
      userId: studentUser.id,
      level: 'BEGINNER',
      completedLessons: 12,
      totalLessons: 18,
      score: 85.5,
    },
  });

  console.log('✅ Created student user and progress');

  // Create sample groups
  const beginnerGroup = await prisma.group.upsert({
    where: { id: 'beginner-group-1' },
    update: {},
    create: {
      id: 'beginner-group-1',
      name: 'Beginner Yoruba Learners',
      description: 'A supportive group for beginners learning Yoruba fundamentals',
      teacherId: teacherUser.id,
      level: 'BEGINNER',
      maxMembers: 20,
      isActive: true,
    },
  });

  const advancedGroup = await prisma.group.upsert({
    where: { id: 'advanced-group-1' },
    update: {},
    create: {
      id: 'advanced-group-1',
      name: 'Advanced Grammar Class',
      description: 'Deep dive into complex Yoruba grammar structures',
      teacherId: teacherUser.id,
      level: 'ADVANCED',
      maxMembers: 15,
      isActive: true,
    },
  });

  // Add student to beginner group
  await prisma.groupMember.upsert({
    where: {
      userId_groupId: {
        userId: studentUser.id,
        groupId: beginnerGroup.id,
      }
    },
    update: {},
    create: {
      userId: studentUser.id,
      groupId: beginnerGroup.id,
    },
  });

  console.log('✅ Created groups and memberships');

  // Create sample book club
  const bookClub = await prisma.bookClub.upsert({
    where: { id: 'yoruba-literature-club' },
    update: {},
    create: {
      id: 'yoruba-literature-club',
      name: 'Yoruba Literature Club',
      description: 'Explore classic and contemporary Yoruba literature',
      currentBook: 'Yoruba Proverbs and Their Meanings',
      isActive: true,
    },
  });

  // Add student to book club
  await prisma.bookClubMember.upsert({
    where: {
      userId_bookClubId: {
        userId: studentUser.id,
        bookClubId: bookClub.id,
      }
    },
    update: {},
    create: {
      userId: studentUser.id,
      bookClubId: bookClub.id,
    },
  });

  console.log('✅ Created book club and memberships');

  // Create sample e-library resources
  const resources = await Promise.all([
    prisma.eLibraryResource.create({
      data: {
        title: 'Yoruba Folktales Collection',
        description: 'Traditional Yoruba stories and their cultural significance',
        fileUrl: '/resources/yoruba-folktales.pdf',
        fileType: 'pdf',
        level: 'BEGINNER',
        category: 'Literature',
        isPublic: true,
      },
    }),
    prisma.eLibraryResource.create({
      data: {
        title: 'Modern Yoruba Grammar Guide',
        description: 'Comprehensive guide to contemporary Yoruba grammar',
        fileUrl: '/resources/modern-grammar.pdf',
        fileType: 'pdf',
        level: 'ADVANCED',
        category: 'Grammar',
        isPublic: true,
      },
    }),
    prisma.eLibraryResource.create({
      data: {
        title: 'Yoruba Pronunciation Audio Guide',
        description: 'Audio guide for proper Yoruba pronunciation',
        fileUrl: '/resources/pronunciation-guide.mp3',
        fileType: 'audio',
        level: 'NOVICE',
        category: 'Pronunciation',
        isPublic: true,
      },
    }),
  ]);

  console.log('✅ Created e-library resources');

  // Create sample live sessions
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(15, 0, 0, 0); // 3 PM tomorrow

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(10, 0, 0, 0); // 10 AM next week

  const sessions = await Promise.all([
    prisma.liveSession.create({
      data: {
        title: 'Yoruba Grammar Basics',
        description: 'Introduction to fundamental Yoruba grammar concepts',
        teacherId: teacherUser.id,
        groupId: beginnerGroup.id,
        scheduledAt: tomorrow,
        duration: 60,
        status: 'SCHEDULED',
        maxAttendees: 20,
        meetingUrl: 'https://meet.example.com/yoruba-grammar-basics',
      },
    }),
    prisma.liveSession.create({
      data: {
        title: 'Advanced Conversation Practice',
        description: 'Practice advanced Yoruba conversation skills',
        teacherId: teacherUser.id,
        groupId: advancedGroup.id,
        scheduledAt: nextWeek,
        duration: 90,
        status: 'SCHEDULED',
        maxAttendees: 15,
        meetingUrl: 'https://meet.example.com/advanced-conversation',
      },
    }),
  ]);

  console.log('✅ Created live sessions');

  // Create newsletter subscriptions
  await prisma.newsletter.createMany({
    data: [
      { email: 'subscriber1@example.com' },
      { email: 'subscriber2@example.com' },
      { email: 'subscriber3@example.com' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created newsletter subscriptions');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📧 Test accounts created:');
  console.log('Admin: admin@ewaedeyoruba.com / admin123');
  console.log('Teacher: teacher@ewaedeyoruba.com / teacher123');
  console.log('Student: student@ewaedeyoruba.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });