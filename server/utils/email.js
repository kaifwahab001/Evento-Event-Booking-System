require('dotenv').config();
const SibApiV3Sdk = require('@getbrevo/brevo');

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const FROM = { email: process.env.EMAIL_USER, name: 'Eventora' };

exports.sendOTPEmail = async (email, otp, type) => {
  try {
    await emailApi.sendTransacEmail({
      sender: FROM,
      to: [{ email }],
      subject: type === 'account_verification'
        ? 'Verify Your Eventora Account'
        : 'Event Booking Verification',
      htmlContent: `
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
      `
    });
    console.log(`OTP sent successfully to ${email} for ${type}`);
  } catch (error) {
    console.error('Error sending OTP email:', error?.response?.body || error);
    throw new Error('Failed to send OTP email');
  }
};

exports.sendBookingEmail = async (email, username, eventTitle) => {
  try {
    await emailApi.sendTransacEmail({
      sender: FROM,
      to: [{ email }],
      subject: 'Booking Confirmed!',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; text-align: center;">
            <h1 style="color: #28a745;">Booking Confirmed!</h1>
            <p style="color: #333; font-size: 16px;">Dear ${username},</p>
            <p style="color: #555; font-size: 16px;">
              Your registration for the event <strong>${eventTitle}</strong> has been successfully confirmed.
            </p>
            <div style="margin: 20px 0; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
              <strong>Event:</strong> ${eventTitle}<br>
              <strong>Status:</strong> <span style="color: #28a745;">Confirmed</span>
            </div>
            <p style="color: #666; font-size: 14px;">We look forward to seeing you there!</p>
            <p style="color: #888; font-size: 12px; margin-top: 30px;">Thank you for choosing Eventora.</p>
          </div>
        </div>
      `
    });
    console.log(`Booking confirmation sent to ${email}`);
  } catch (error) {
    console.error('Error sending booking email:', error?.response?.body || error);
    throw new Error('Failed to send booking email');
  }
};