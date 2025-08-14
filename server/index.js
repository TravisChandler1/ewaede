const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../src/generated/prisma');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email service functions
const sendEmail = async (to, subject, html, text) => {
  try {
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const sendWelcomeEmail = async (email, firstName, learningLevel) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Ewa Ede Yoruba Academy</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2D3748; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .button { display: inline-block; background: #38A169; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .footer { background: #2D3748; color: white; padding: 15px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Ẹ kú àbọ̀ sí Ewa Ede Yoruba Academy!</h1>
          <p>Welcome to Ewa Ede Yoruba Academy!</p>
        </div>
        <div class="content">
          <h2>Ẹ kú àbọ̀, ${firstName}!</h2>
          <p>We're thrilled to welcome you to our Yoruba learning community! Your journey to master the beautiful Yoruba language starts now.</p>
          
          <h3>Your Learning Details:</h3>
          <ul>
            <li><strong>Learning Level:</strong> ${learningLevel}</li>
            <li><strong>Account Status:</strong> Active</li>
            <li><strong>Access:</strong> Full platform access</li>
          </ul>

          <a href="http://localhost:3000/student-dashboard" class="button">
            Access Your Dashboard
          </a>

          <p><strong>Need help?</strong> Our support team is here to assist you at support@ewaedeyoruba.com</p>
        </div>
        <div class="footer">
          <p>Ewa Ede Yoruba Academy - Empowering Yoruba Language Learning</p>
          <p>© 2024 All rights reserved</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(
    email,
    'Ẹ kú àbọ̀! Welcome to Ewa Ede Yoruba Academy',
    html,
    `Welcome to Ewa Ede Yoruba Academy, ${firstName}! Your ${learningLevel} level account is now active.`
  );
};

const sendNewsletterConfirmation = async (email) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Newsletter Subscription Confirmed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #38A169; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .footer { background: #2D3748; color: white; padding: 15px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Newsletter Subscription Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Ẹ kú àbọ̀!</h2>
          <p>Thank you for subscribing to the Ewa Ede Yoruba Academy newsletter!</p>
          
          <p>You'll now receive:</p>
          <ul>
            <li>Weekly Yoruba lessons and tips</li>
            <li>Cultural insights and stories</li>
            <li>Pronunciation guides</li>
            <li>Exclusive access to community events</li>
            <li>Updates on new courses and features</li>
          </ul>

          <p>We're excited to be part of your Yoruba learning journey!</p>
          
          <p><em>Ẹ ṣé púpọ̀ (Thank you very much)!</em></p>
        </div>
        <div class="footer">
          <p>Ewa Ede Yoruba Academy - Empowering Yoruba Language Learning</p>
          <p>© 2024 All rights reserved</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(
    email,
    'Newsletter Subscription Confirmed - Ewa Ede Yoruba Academy',
    html,
    'Thank you for subscribing to our newsletter! You\'ll receive weekly Yoruba lessons and cultural insights.'
  );
};

// API Routes

// Newsletter subscription
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Save to database
    await prisma.newsletter.upsert({
      where: { email },
      update: { isActive: true },
      create: { email, isActive: true },
    });

    // Send confirmation email
    await sendNewsletterConfirmation(email);

    res.json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
});

// Student dashboard data
app.get('/api/student/dashboard', async (req, res) => {
  try {
    // This would normally get the user ID from the JWT token
    // For now, we'll use a mock response
    const mockData = {
      id: '1',
      firstName: 'Adebayo',
      lastName: 'Johnson',
      email: 'student@ewaedeyoruba.com',
      learningLevel: 'BEGINNER',
      teachingType: 'GROUP',
      progress: {
        level: 'BEGINNER',
        completedLessons: 12,
        totalLessons: 18,
        studyHours: 24,
        progressPercentage: 67,
      },
      upcomingSessions: [
        {
          id: '1',
          title: 'Yoruba Grammar Basics',
          teacher: 'Adunni Olatunji',
          teacherId: '2',
          time: 'Today, 3:00 PM',
          scheduledAt: new Date().toISOString(),
          duration: 60,
          type: 'Group Session',
          participants: 8,
          status: 'scheduled',
          level: 'Beginner',
        },
      ],
      myGroups: [
        {
          id: '1',
          name: 'Beginner Yoruba Learners',
          description: 'A supportive group for beginners',
          members: 15,
          maxMembers: 20,
          level: 'Beginner',
          lastActivity: '2 hours ago',
          teacherId: '2',
          teacher: 'Adunni Olatunji',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ],
      recentBooks: [
        {
          id: '1',
          title: 'Yoruba Folktales Collection',
          description: 'Traditional Yoruba stories',
          author: 'Traditional',
          progress: 45,
          type: 'Audio Book',
          fileUrl: '/resources/folktales.mp3',
          fileType: 'audio',
          category: 'Literature',
          level: 'BEGINNER',
        },
      ],
      bookClubs: [
        {
          id: '1',
          name: 'Yoruba Literature Club',
          description: 'Explore classic and contemporary Yoruba literature',
          currentBook: 'Yoruba Proverbs and Their Meanings',
          members: 34,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ],
      pricingPlan: {
        level: 'BEGINNER',
        name: 'Beginner',
        monthlyPrice: 49,
        features: ['Grammar basics', 'Common phrases', 'Interactive exercises', 'Group sessions', 'E-library access'],
      },
    };

    res.json({ success: true, data: mockData });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Update student progress
app.post('/api/student/progress', async (req, res) => {
  try {
    const { lessonId } = req.body;
    
    // Mock progress update
    res.json({ 
      success: true, 
      message: 'Progress updated successfully',
      data: { lessonId, completed: true }
    });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Join group
app.post('/api/student/groups/:groupId/join', async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Mock group join
    res.json({ 
      success: true, 
      message: 'Successfully joined group',
      data: { groupId }
    });
  } catch (error) {
    console.error('Group join error:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// Leave group
app.delete('/api/student/groups/:groupId/leave', async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Mock group leave
    res.json({ 
      success: true, 
      message: 'Successfully left group',
      data: { groupId }
    });
  } catch (error) {
    console.error('Group leave error:', error);
    res.status(500).json({ error: 'Failed to leave group' });
  }
});

// Join session
app.post('/api/student/sessions/:sessionId/join', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Mock session join
    res.json({ 
      success: true, 
      message: 'Successfully joined session',
      data: { 
        sessionId,
        meetingUrl: 'https://meet.example.com/session-' + sessionId
      }
    });
  } catch (error) {
    console.error('Session join error:', error);
    res.status(500).json({ error: 'Failed to join session' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Ewa Ede Academy API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ewa Ede Academy API server running on port ${PORT}`);
  console.log(`📧 Email service configured with SMTP: ${process.env.SMTP_HOST}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});