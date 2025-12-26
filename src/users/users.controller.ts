import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * STEP 1
   * User submits email + password
   * OTP is sent to email
   */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * STEP 2
   * User submits email + otp
   * Account is verified and created
   */
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  /**
   * PASSWORD LOGIN
   */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * GOOGLE LOGIN
   * Frontend sends verified email
   */
  @Post('google')
  async googleLogin(@Body('email') email: string) {
    return this.authService.googleLogin(email);
  }
}
