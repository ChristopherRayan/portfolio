import nodemailer from 'nodemailer';

// Email configuration from environment variables
const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

/**
 * Professional email transporter using Gmail SMTP
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_APP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Core utility to send an email
 */
export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD) {
    console.error('Email credentials not configured');
    return { success: false, error: 'Email configuration missing' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"CRK Portfolio" <${GMAIL_EMAIL}>`,
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Specialized utility for blog notifications
 */
export async function sendBlogNotification(to: string, blog: any, unsubToken: string) {
  const unsubLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/unsubscribe/${unsubToken}`;
  const blogLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/blog/${blog.slug}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333;">New Post: ${blog.title}</h2>
      <p style="color: #666; font-size: 16px; line-height: 1.6;">${blog.excerpt}</p>
      <div style="margin: 30px 0;">
        <a href="${blogLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Read More</a>
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 40px;">
      <p style="color: #999; font-size: 12px;">
        You're receiving this because you subscribed to CRK Portfolio updates. 
        <br>
        <a href="${unsubLink}" style="color: #999;">Unsubscribe</a>
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `New Blog Post: ${blog.title}`,
    html,
  });
}

/**
 * Broadcasts a blog notification to all active subscribers in batches
 */
export async function broadcastBlogNotification(blog: any) {
  // We import models dynamically inside to avoid circular dependencies 
  // and issues with Next.js edge/serverless environments if applicable
  const { default: Subscriber } = await import('@/models/Subscriber');
  const { default: EmailLog } = await import('@/models/EmailLog');
  const { default: dbConnect } = await import('@/lib/db');

  await dbConnect();

  try {
    const activeSubscribers = await Subscriber.find({ isActive: true });
    
    if (activeSubscribers.length === 0) return;

    // Process in batches of 10 to be safe with Gmail SMTP
    const BATCH_SIZE = 10;
    for (let i = 0; i < activeSubscribers.length; i += BATCH_SIZE) {
      const batch = activeSubscribers.slice(i, i + BATCH_SIZE);
      
      await Promise.all(batch.map(async (sub) => {
        try {
          const result = await sendBlogNotification(sub.email, blog, sub.unsubToken);
          
          // Log the result
          await EmailLog.create({
            subscriber: sub._id,
            blog: blog._id,
            status: result.success ? 'SENT' : 'FAILED',
            error: result.error
          });
        } catch (error: any) {
            console.error(`Error sending to ${sub.email}:`, error);
        }
      }));

      // Small delay between batches if it's a large list
      if (i + BATCH_SIZE < activeSubscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    console.error('Broadcast failed:', error);
  }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!GMAIL_EMAIL) {
    console.error('Gmail email not configured');
    return { success: false, error: 'Email not configured' };
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Contact Form Submission</h2>
      
      <div style="margin: 20px 0;">
        <p style="margin: 10px 0;"><strong>From:</strong> ${contactData.name}</p>
        <p style="margin: 10px 0;"><strong>Email:</strong> ${contactData.email}</p>
        <p style="margin: 10px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; color: #333; line-height: 1.6;"><strong>Message:</strong></p>
        <p style="margin: 10px 0 0 0; color: #666; line-height: 1.6;">${contactData.message}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        This email was sent from the CRK Portfolio contact form at ${new Date().toLocaleString()}
      </p>
    </div>
  `;

  return sendEmail({
    to: GMAIL_EMAIL,
    subject: `Portfolio Contact: ${contactData.subject}`,
    html,
  });
}

