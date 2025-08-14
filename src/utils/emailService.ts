import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', options.to);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Welcome email for new students
  static async sendStudentWelcomeEmail(
    email: string,
    firstName: string,
    learningLevel: string
  ): Promise<boolean> {
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

            <h3>What's Next?</h3>
            <p>Here's what you can do to get started:</p>
            <ol>
              <li>Complete your profile setup</li>
              <li>Join study groups matching your level</li>
              <li>Browse our e-library resources</li>
              <li>Book your first live session</li>
              <li>Participate in our book club discussions</li>
            </ol>

            <a href="${process.env.REACT_APP_SUPABASE_URL || 'http://localhost:3000'}/student-dashboard" class="button">
              Access Your Dashboard
            </a>

            <p><strong>Need help?</strong> Our support team is here to assist you at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a></p>
          </div>
          <div class="footer">
            <p>Ewa Ede Yoruba Academy - Empowering Yoruba Language Learning</p>
            <p>© 2024 All rights reserved</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Ẹ kú àbọ̀! Welcome to Ewa Ede Yoruba Academy',
      html,
      text: `Welcome to Ewa Ede Yoruba Academy, ${firstName}! Your ${learningLevel} level account is now active. Visit your dashboard to get started.`,
    });
  }

  // Teacher application submitted email
  static async sendTeacherApplicationEmail(
    email: string,
    firstName: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Teacher Application Received</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2D3748; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8f9fa; }
          .footer { background: #2D3748; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Teacher Application Received</h1>
          </div>
          <div class="content">
            <h2>Dear ${firstName},</h2>
            <p>Thank you for your interest in becoming a teacher at Ewa Ede Yoruba Academy!</p>
            
            <p>We have received your application and our admin team will review it carefully. Here's what happens next:</p>
            
            <ol>
              <li><strong>Review Process:</strong> Our team will evaluate your application within 2-3 business days</li>
              <li><strong>Background Check:</strong> We may contact you for additional information</li>
              <li><strong>Decision:</strong> You'll receive an email notification with our decision</li>
              <li><strong>Onboarding:</strong> If approved, we'll guide you through the teacher onboarding process</li>
            </ol>

            <p><strong>Application Status:</strong> Pending Review</p>
            
            <p>In the meantime, you can visit your pending status page to track your application progress.</p>

            <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a></p>
          </div>
          <div class="footer">
            <p>Ewa Ede Yoruba Academy - Empowering Yoruba Language Learning</p>
            <p>© 2024 All rights reserved</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Teacher Application Received - Ewa Ede Yoruba Academy',
      html,
      text: `Dear ${firstName}, your teacher application has been received and is under review. You'll hear from us within 2-3 business days.`,
    });
  }

  // Teacher approval email
  static async sendTeacherApprovalEmail(
    email: string,
    firstName: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Teacher Application Approved!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #38A169; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8f9fa; }
          .button { display: inline-block; background: #38A169; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { background: #2D3748; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>Your Teacher Application Has Been Approved</p>
          </div>
          <div class="content">
            <h2>Dear ${firstName},</h2>
            <p>We're excited to inform you that your teacher application has been <strong>approved</strong>!</p>
            
            <p>Welcome to the Ewa Ede Yoruba Academy teaching team. You can now:</p>
            
            <ul>
              <li>Access your teacher dashboard</li>
              <li>Create and manage study groups</li>
              <li>Schedule live teaching sessions</li>
              <li>Track student progress</li>
              <li>Upload teaching resources</li>
            </ul>

            <a href="${process.env.REACT_APP_SUPABASE_URL || 'http://localhost:3000'}/teacher-dashboard" class="button">
              Access Teacher Dashboard
            </a>

            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Complete your teacher profile</li>
              <li>Set up your teaching schedule</li>
              <li>Create your first study group</li>
              <li>Review our teaching guidelines</li>
            </ol>

            <p>If you need any assistance getting started, please contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a></p>
          </div>
          <div class="footer">
            <p>Ewa Ede Yoruba Academy - Empowering Yoruba Language Learning</p>
            <p>© 2024 All rights reserved</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '🎉 Teacher Application Approved - Welcome to the Team!',
      html,
      text: `Congratulations ${firstName}! Your teacher application has been approved. You can now access your teacher dashboard and start teaching.`,
    });
  }

  // Teacher rejection email
  static async sendTeacherRejectionEmail(
    email: string,
    firstName: string,
    reason?: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Teacher Application Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2D3748; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8f9fa; }
          .footer { background: #2D3748; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Teacher Application Update</h1>
          </div>
          <div class="content">
            <h2>Dear ${firstName},</h2>
            <p>Thank you for your interest in becoming a teacher at Ewa Ede Yoruba Academy.</p>
            
            <p>After careful consideration, we regret to inform you that we cannot approve your teacher application at this time.</p>
            
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            
            <p>This decision doesn't reflect on your qualifications or passion for teaching Yoruba. We encourage you to:</p>
            
            <ul>
              <li>Continue developing your teaching skills</li>
              <li>Gain more experience in Yoruba language instruction</li>
              <li>Consider reapplying in the future</li>
              <li>Join as a student to experience our platform</li>
            </ul>

            <p>We appreciate your interest in our mission to promote Yoruba language learning.</p>

            <p>If you have any questions about this decision, please contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a></p>
          </div>
          <div class="footer">
            <p>Ewa Ede Yoruba Academy - Empowering Yoruba Language Learning</p>
            <p>© 2024 All rights reserved</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Teacher Application Update - Ewa Ede Yoruba Academy',
      html,
      text: `Dear ${firstName}, thank you for your teacher application. Unfortunately, we cannot approve it at this time. ${reason ? `Reason: ${reason}` : ''} Please feel free to reapply in the future.`,
    });
  }

  // Newsletter subscription confirmation
  static async sendNewsletterConfirmation(email: string): Promise<boolean> {
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
            <p><a href="#" style="color: #ccc;">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Newsletter Subscription Confirmed - Ewa Ede Yoruba Academy',
      html,
      text: 'Thank you for subscribing to our newsletter! You\'ll receive weekly Yoruba lessons and cultural insights.',
    });
  }

  // Admin notification for new teacher application
  static async sendAdminTeacherNotification(
    teacherName: string,
    teacherEmail: string,
    teacherId: string
  ): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ewaedeyoruba.com';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Teacher Application</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2D3748; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8f9fa; }
          .button { display: inline-block; background: #38A169; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
          .button.reject { background: #E53E3E; }
          .footer { background: #2D3748; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Teacher Application</h1>
          </div>
          <div class="content">
            <h2>Teacher Application Pending Review</h2>
            <p>A new teacher application has been submitted and requires your review.</p>
            
            <h3>Application Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${teacherName}</li>
              <li><strong>Email:</strong> ${teacherEmail}</li>
              <li><strong>Teacher ID:</strong> ${teacherId}</li>
              <li><strong>Status:</strong> Pending</li>
              <li><strong>Applied:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>

            <p>Please review the application and take appropriate action:</p>
            
            <div style="text-align: center;">
              <a href="${process.env.REACT_APP_SUPABASE_URL || 'http://localhost:3000'}/admin-dashboard" class="button">
                Review Application
              </a>
            </div>
          </div>
          <div class="footer">
            <p>Ewa Ede Yoruba Academy - Admin Notification</p>
            <p>© 2024 All rights reserved</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject: `New Teacher Application - ${teacherName}`,
      html,
      text: `New teacher application from ${teacherName} (${teacherEmail}) requires review. Teacher ID: ${teacherId}`,
    });
  }
}

export default EmailService;