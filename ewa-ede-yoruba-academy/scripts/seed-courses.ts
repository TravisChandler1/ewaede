import { PrismaClient, Level } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding courses...');

  // First, create a sample teacher user if it doesn't exist
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@ewaede.com' },
    update: {},
    create: {
      name: 'Adebayo Johnson',
      email: 'teacher@ewaede.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeXt1u4XpaV8hLxUe', // password: teacher123
      role: 'TEACHER',
    },
  });

  // Create sample courses
  const courses = [
    {
      title: 'Yoruba for Beginners',
      slug: 'yoruba-for-beginners',
      description: 'Start your Yoruba language journey with this comprehensive beginner course. Learn basic greetings, vocabulary, and simple conversations.',
      price: 29.99,
      level: Level.BEGINNER,
      duration: 8,
      isPublished: true,
      instructorId: teacher.id,
      thumbnail: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Intermediate Yoruba Conversation',
      slug: 'intermediate-yoruba-conversation',
      description: 'Build on your basic knowledge with intermediate conversation skills. Learn complex sentence structures and cultural contexts.',
      price: 49.99,
      level: Level.ADVANCED,
      duration: 12,
      isPublished: true,
      instructorId: teacher.id,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Advanced Yoruba Literature',
      slug: 'advanced-yoruba-literature',
      description: 'Dive deep into Yoruba literature, proverbs, and traditional storytelling. Perfect for advanced learners.',
      price: 69.99,
      level: Level.ADVANCED,
      duration: 16,
      isPublished: true,
      instructorId: teacher.id,
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Yoruba Business Communication',
      slug: 'yoruba-business-communication',
      description: 'Learn professional Yoruba for business settings. Master formal communication, negotiations, and workplace terminology.',
      price: 59.99,
      level: Level.ADVANCED,
      duration: 10,
      isPublished: true,
      instructorId: teacher.id,
      thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course,
    });
  }

  console.log('✅ Courses seeded successfully!');
  console.log(`📚 Created ${courses.length} sample courses`);
  console.log('👨‍🏫 Created teacher account: teacher@ewaede.com (password: teacher123)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding courses:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });