const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Testing database connection...');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);

    // Test creating a test user (optional)
    console.log('🔄 Testing user creation...');
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'STUDENT'
      }
    });
    console.log('✅ Test user created:', testUser.id);

    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('🧹 Test user cleaned up');

    console.log('🎉 All database tests passed!');

  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);

    if (error.message.includes('connect')) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Check if Supabase database is running');
      console.log('2. Verify DATABASE_URL in .env file');
      console.log('3. Check network connectivity');
      console.log('4. Verify database credentials');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();