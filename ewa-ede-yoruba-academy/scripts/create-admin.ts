import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function createAdmin() {
  const email = 'ewaede@gmail.com.ng';
  const password = 'admin123';
  const name = 'Ewaede Admin';

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log(`Email: ${email}`);
      console.log(`ID: ${existingAdmin.id}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('----------------------------');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('----------------------------');
    console.log('🚨 IMPORTANT: Change this password after first login!');
    console.log('----------------------------');
  } catch (error: any) {
    console.error('❌ Error creating admin user:');
    console.error(error.message);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin()
  .catch((e) => {
    console.error('Fatal error in createAdmin:');
    console.error(e);
    process.exit(1);
  });
