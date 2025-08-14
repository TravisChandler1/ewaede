# Gmail SMTP Setup Guide for Ewa Ede Yoruba Academy

This guide will help you configure Gmail SMTP for sending emails from your application.

## 🔧 Gmail SMTP Configuration

### Step 1: Enable 2-Factor Authentication

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the prompts to enable 2FA if not already enabled

### Step 2: Generate App Password

1. In your Google Account settings, go to **Security**
2. Under "Signing in to Google", click **App passwords**
3. You may need to sign in again
4. Select **Mail** from the "Select app" dropdown
5. Select **Other (Custom name)** from the "Select device" dropdown
6. Enter "Ewa Ede Academy" as the custom name
7. Click **Generate**
8. **Copy the 16-character app password** (you'll need this for your .env file)

### Step 3: Update Your .env File

Replace the Gmail SMTP placeholders in your `.env` file:

```env
# Gmail SMTP Configuration for Email Services
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-actual-gmail@gmail.com"
SMTP_PASS="your-16-character-app-password"
FROM_EMAIL="noreply@ewaedeyoruba.com"
FROM_NAME="Ewa Ede Yoruba Academy"

# Email Templates Configuration
ADMIN_EMAIL="your-admin-email@gmail.com"
SUPPORT_EMAIL="your-support-email@gmail.com"
```

**Example with real values:**
```env
SMTP_USER="ewaedeyoruba@gmail.com"
SMTP_PASS="abcd efgh ijkl mnop"  # Your 16-character app password
FROM_EMAIL="noreply@ewaedeyoruba.com"
FROM_NAME="Ewa Ede Yoruba Academy"
ADMIN_EMAIL="admin@ewaedeyoruba.com"
SUPPORT_EMAIL="support@ewaedeyoruba.com"
```

## 🚀 Testing Your Email Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Generate Prisma Client

```bash
npm run db:generate
```

### Step 3: Push Database Schema

```bash
npm run db:push
```

### Step 4: Start Both Frontend and Backend

```bash
# Start both React app and API server
npm run dev

# Or start them separately:
# Terminal 1: Start API server
npm run server

# Terminal 2: Start React app
npm start
```

### Step 5: Test Email Functionality

1. **Newsletter Subscription:**
   - Go to `http://localhost:3000`
   - Scroll to the newsletter section
   - Enter an email and subscribe
   - Check the email inbox for confirmation

2. **Student Registration:**
   - Go to `http://localhost:3000/signup`
   - Register as a student
   - Check email for welcome message

3. **Teacher Registration:**
   - Go to `http://localhost:3000/signup`
   - Register as a teacher
   - Check email for application confirmation
   - Admin should receive notification email

## 📧 Email Templates Included

Your application now sends these automated emails:

### For Students:
- ✅ **Welcome Email** - Sent when student account is created
- ✅ **Session Reminders** - Before scheduled sessions
- ✅ **Progress Updates** - When milestones are reached

### For Teachers:
- ✅ **Application Confirmation** - When teacher applies
- ✅ **Approval Notification** - When application is approved
- ✅ **Rejection Notification** - When application is rejected (with reason)

### For Admins:
- ✅ **New Teacher Application** - When teacher applies
- ✅ **System Notifications** - Important platform updates

### For Everyone:
- ✅ **Newsletter Confirmation** - When subscribing to newsletter
- ✅ **Password Reset** - For password recovery (if implemented)

## 🔒 Security Best Practices

### Email Security:
1. **Never commit your app password** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate app passwords** regularly
4. **Monitor email sending** for unusual activity

### Gmail Limits:
- **Daily limit**: 500 emails per day for Gmail accounts
- **Rate limit**: 100 emails per hour
- **Recipient limit**: 100 recipients per email

### For Production:
Consider upgrading to:
- **Google Workspace** for higher limits
- **SendGrid** or **Mailgun** for transactional emails
- **Amazon SES** for cost-effective bulk emails

## 🛠️ Troubleshooting

### Common Issues:

**"Invalid credentials" error:**
- Verify your Gmail address is correct
- Ensure you're using the app password, not your regular password
- Check that 2FA is enabled on your Google account

**"Connection timeout" error:**
- Verify SMTP settings (host: smtp.gmail.com, port: 587)
- Check your internet connection
- Ensure your firewall isn't blocking port 587

**Emails not being sent:**
- Check the server console for error messages
- Verify your .env file is loaded correctly
- Test with a simple email first

**Emails going to spam:**
- Use a proper FROM_EMAIL domain
- Include unsubscribe links
- Avoid spam trigger words
- Consider SPF/DKIM records for your domain

### Debug Mode:

Add this to your server code for debugging:

```javascript
// Add to server/index.js for debugging
transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});
```

## 📊 Email Analytics

Track email performance:

```javascript
// Add to your email service
const emailStats = {
  sent: 0,
  delivered: 0,
  failed: 0,
  opened: 0, // Requires tracking pixels
};
```

## 🔄 Email Queue (Advanced)

For high-volume emails, consider implementing a queue:

```bash
npm install bull redis
```

```javascript
// Example email queue setup
const Queue = require('bull');
const emailQueue = new Queue('email processing');

emailQueue.process(async (job) => {
  const { to, subject, html } = job.data;
  return await sendEmail(to, subject, html);
});
```

## 🎯 Next Steps

1. **Test all email flows** with real email addresses
2. **Customize email templates** with your branding
3. **Set up email analytics** to track performance
4. **Implement email preferences** for users
5. **Add email verification** for new accounts
6. **Set up automated email campaigns** for engagement

## 📞 Support

If you encounter issues:

1. Check the [Gmail SMTP documentation](https://support.google.com/mail/answer/7126229)
2. Review your server logs for error messages
3. Test SMTP connection with a simple script
4. Verify your Google Account security settings

Your email system is now ready to enhance user engagement and provide professional communication for your Yoruba learning platform! 🎉

---

**Important:** Keep your app password secure and never share it publicly. Treat it like a regular password.