import { PrismaClient } from '@prisma/client';

async function testConnection() {
  const prisma = new PrismaClient({
    datasourceUrl: 'postgresql://postgres:Oladeni@123.@db.nopsgzfaehuijfxxeanj.supabase.co:5432/postgres',
    log: ['query', 'info', 'warn', 'error']
  });

  try {
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');

    console.log('\n📊 Database version:');
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log(result);

    console.log('\n👥 Checking for existing users:');
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users in the database`);
    if (users.length > 0) {
      console.log('Existing users:', users.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      })));
    }
  } catch (error) {
    console.error('❌ Failed to connect to the database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().catch(console.error);
