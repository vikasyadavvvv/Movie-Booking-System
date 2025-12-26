import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  /**
   * Mock email sender
   * Replace this later with:
   * - AWS SES
   * - SendGrid
   * - Nodemailer
   */
  async sendOtp(email: string, otp: string): Promise<void> {
    // In production, NEVER log OTP
    // This is only for development/testing
    this.logger.log(`Sending OTP to ${email}`);

    console.log(`📧 OTP for ${email}: ${otp}`);
  }
}
