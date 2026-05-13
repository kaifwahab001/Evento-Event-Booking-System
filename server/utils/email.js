require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// For testing, Resend lets you send from onboarding@resend.dev to your own email.
// For production, add & verify your domain at resend.com/domains, then use your@yourdomain.com
const FROM_ADDRESS = process.env.EMAIL_USER ;

const otpTemplate = (otp, type) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; text-align: center;">
      <h2 style="color: #333;">Hello,</h2>
      <p style="color: #666; font-size: 16px;">
        ${type === 'account_verification'
          ? 'Please use the following OTP to verify your Eventora account.'
          : 'Please use the following OTP to confirm your event booking.'}
      </p>
      <div style="background-color: #007bff; color: white; padding: 15px; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="color: #888; font-size: 14px;">This OTP is valid for 5 minutes.</p>
      <p style="color: #888; font-size: 14px;">If you did not request this, please ignore this email.</p>
    </div>
  </div>
`;

const bookingTemplate = (username, eventTitle) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; text-align: center;">
      <h1 style="color: #28a745;">Booking Confirmed!</h1>
      <p style="color: #333; font-size: 16px;">Dear ${username},</p>
      <p style="color: #555; font-size: 16px;">
        Your registration for <strong>${eventTitle}</strong> has been successfully confirmed.
      </p>
      <div style="margin: 20px 0; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
        <strong>Event:</strong> ${eventTitle}<br>
        <strong>Status:</strong> <span style="color: #28a745;">Confirmed</span>
      </div>
      <p style="color: #666; font-size: 14px;">We look forward to seeing you there!</p>
      <p style="color: #888; font-size: 12px; margin-top: 30px;">Thank you for choosing Eventora.</p>
    </div>
  </div>
`;

exports.sendOTPEmail = async (email, otp, type) => {
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: type === 'account_verification'
      ? 'Verify Your Eventora Account'
      : 'Event Booking Verification',
    html: otpTemplate(otp, type),
  });

  if (error) {
    console.error('Error sending OTP email:', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }

  console.log(`OTP sent successfully to ${email} for ${type}`);
};

exports.sendBookingEmail = async (email, username, eventTitle) => {
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: 'Booking Confirmed!',
    html: bookingTemplate(username, eventTitle),
  });

  if (error) {
    console.error('Error sending booking email:', error);
    throw new Error(`Failed to send booking email: ${error.message}`);
  }

  console.log(`Booking confirmation sent to ${email}`);
};