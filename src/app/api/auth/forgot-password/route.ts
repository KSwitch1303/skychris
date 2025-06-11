import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Please provide your email address'
      }, { status: 400 });
    }

    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email });

    // Even if user not found, we don't want to reveal that to potential attackers
    // So we'll still return a success message
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      // In production, you might want to log this attempt
      
      // We still return success to avoid leaking which emails exist in the system
      return NextResponse.json({
        success: true,
        message: 'If your email exists in our system, you will receive password reset instructions'
      });
    }

    // Generate a reset token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Hash the token for storage (security best practice)
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Update user with reset token and expiry
    user.resetToken = hashedResetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // In a real production environment, send an email with reset link
    // Example using a mail service like SendGrid or AWS SES would go here
    // const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    
    /* 
    // Example email sending (not implemented):
    await sendEmail({
      to: user.email,
      subject: 'Swift Mint Flow - Password Reset',
      text: `You requested a password reset. Please click on the link to reset your password: ${resetUrl}. This link is valid for 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #06D6A0;">Swift Mint Flow</h2>
          <p>Hello,</p>
          <p>You requested a password reset for your Swift Mint Flow account.</p>
          <p>Please click the button below to reset your password. The link is valid for 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #06D6A0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
          <p>Thank you,<br/>The Swift Mint Flow Team</p>
        </div>
      `
    });
    */

    // For development/testing, log the token (would be removed in production)
    console.log(`Reset token for ${email}: ${resetToken}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions sent to your email',
      // In development, you might want to include this for testing
      devToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request'
    }, { status: 500 });
  }
}
