import nodemailer from 'nodemailer';
import Transaction from '../models/Transaction.js';
import dotenv from 'dotenv';
import { format } from 'date-fns';

dotenv.config();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email notification
const sendNotification = async (transaction, daysLeft) => {
  try {
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('user')
      .populate('book');
    
    const { user, book, dueDate } = populatedTransaction;
    
    const emailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Return Reminder: ${book.title} is due in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">Book Return Reminder</h2>
          <p>Dear ${user.name},</p>
          <p>This is a reminder that your borrowed book is due soon:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Book:</strong> ${book.title}</p>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Due Date:</strong> ${format(dueDate, 'PPP')}</p>
            <p><strong>Time Remaining:</strong> ${daysLeft} day${daysLeft > 1 ? 's' : ''}</p>
          </div>
          <p>Please return the book on time to avoid a late fee of ₹5 per day.</p>
          <p>Thank you for using our E-Library!</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>This is an automated message from the E-Library Management System. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(emailOptions);
    
    // Update notification status
    if (daysLeft === 1) {
      transaction.notificationSent.oneDay = true;
    } else if (daysLeft === 2) {
      transaction.notificationSent.twoDays = true;
    }
    
    await transaction.save();
    console.log(`Notification sent to ${user.email} for book ${book.title}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Check for due books and send notifications
const checkDueBooks = async () => {
  try {
    const today = new Date();
    const transactions = await Transaction.find({ status: 'issued' });
    
    for (const transaction of transactions) {
      const dueDate = new Date(transaction.dueDate);
      const timeDiff = dueDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Send notification 2 days before due date
      if (daysLeft === 2 && !transaction.notificationSent.twoDays) {
        await sendNotification(transaction, 2);
      }
      
      // Send notification 1 day before due date
      if (daysLeft === 1 && !transaction.notificationSent.oneDay) {
        await sendNotification(transaction, 1);
      }
    }
  } catch (error) {
    console.error('Error checking due books:', error);
  }
};

// Schedule email notifications to run daily
export const setupEmailScheduler = () => {
  // Run once at startup
  checkDueBooks();
  
  // Then schedule to run daily at midnight
  const millisecondsUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0
    );
    return midnight.getTime() - now.getTime();
  };
  
  // Schedule first run at midnight
  setTimeout(() => {
    checkDueBooks();
    
    // Then schedule to run every 24 hours
    setInterval(checkDueBooks, 24 * 60 * 60 * 1000);
  }, millisecondsUntilMidnight());
  
  console.log('Email scheduler setup complete');
};