import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const sendgridApiKey = process.env.SENDGRID_API_KEY;

if (!sendgridApiKey) {
  console.error('SendGrid API key is not set in the environment variables.');
  throw new Error('SendGrid API key must be configured.');
}

sgMail.setApiKey(sendgridApiKey);

interface MailOptions {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: MailOptions): Promise<void> => {
  try {
    await sgMail.send(options);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error(`Failed to send email to ${options.to}:`, error);
    throw new Error('Failed to send email.');
  }
};
