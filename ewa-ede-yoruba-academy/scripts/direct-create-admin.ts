import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    const email = 'admin@example.com';
    const password = 'admin123';
    const name = 'Admin User';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`Email: ${email}`);
      console.log(`ID: ${existingAdmin.id}`);
      console.log('You can use these credentials to log in.');
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
  } catch (error) {
    console.error('❌ Error creating admin user:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
