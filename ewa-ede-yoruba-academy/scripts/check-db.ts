import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
    
    console.log('\nListing existing users:');
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
    
    if (users.length === 0) {
      console.log('No users found in the database');
    } else {
      console.table(users);
    }
  } catch (error) {
    console.error('❌ Error connecting to the database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
