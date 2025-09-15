import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    console.log('Registration request received');

    const {
      name,
      email,
      password,
      role = 'STUDENT',
      level = 'NOVICE',
      firstName,
      lastName,
      dateOfBirth,
      educationLevel,
      institution,
      courseOfStudy,
      phoneNumber,
      country,
      newsletter
    } = await request.json();

    console.log('Registration data:', {
      name,
      email,
      role,
      firstName,
      lastName,
      educationLevel,
      institution,
      courseOfStudy,
      phoneNumber,
      country,
      newsletter
    });

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    // Create user
    console.log('Creating user...');
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
      },
    });
    console.log('User created successfully:', user.id);

    // Create corresponding profile based on role
    if (role.toUpperCase() === 'STUDENT') {
      console.log('Creating student profile for user:', user.id);
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          level: level.toUpperCase(),
          progress: 0,
          bio: courseOfStudy ? `Student of ${courseOfStudy}` : null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          phoneNumber,
          country,
        },
      });
      console.log('Student profile created');
    } else if (role.toUpperCase() === 'TEACHER') {
      console.log('Creating teacher profile for user:', user.id);
      await prisma.teacherProfile.create({
        data: {
          userId: user.id,
          bio: courseOfStudy ? `Specializes in ${courseOfStudy}` : null,
          qualifications: educationLevel ? educationLevel : '',
          experience: 0,
          specialization: courseOfStudy ? courseOfStudy : '',
          isVerified: false, // Admin needs to verify teacher accounts
        },
      });
      console.log('Teacher profile created');
    }

    // Handle newsletter subscription if requested
    if (newsletter && email) {
      try {
        await prisma.newsletterSubscription.upsert({
          where: { email },
          update: { status: 'SUBSCRIBED' },
          create: {
            email,
            status: 'SUBSCRIBED',
            userId: user.id,
          },
        });
        console.log('Newsletter subscription created');
      } catch (newsletterError) {
        console.warn('Newsletter subscription failed:', newsletterError);
        // Don't fail registration if newsletter subscription fails
      }
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Provide more specific error messages
    if (error instanceof Error) {
      // Check for specific database errors
      if (error.message.includes('connect')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please try again.' },
          { status: 500 }
        );
      }

      if (error.message.includes('unique')) {
        return NextResponse.json(
          { error: 'User already exists with this email' },
          { status: 400 }
        );
      }

      if (error.message.includes('profile')) {
        return NextResponse.json(
          { error: 'Failed to create user profile. Please try again.' },
          { status: 500 }
        );
      }

      // Log the actual error for debugging
      console.error('Detailed error:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}