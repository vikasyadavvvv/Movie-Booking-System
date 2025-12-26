import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { LoginType } from 'src/common/enum/login.status.enum';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  // Centralized logger for this service
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,

    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Generates a 6-digit OTP.
   * - Numeric only (easy for users)
   * - NOT cryptographically secure, but fine for short-lived OTP
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * STEP 1: Register user (send OTP)
   * - Do NOT save user in DB yet
   * - Store OTP + signup payload in Redis with TTL
   */
  async register(dto: RegisterDto) {
    this.logger.log(`Register request received for ${dto.email}`);

    // Check if user already exists
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      this.logger.warn(`Registration blocked: email already exists (${dto.email})`);
      throw new BadRequestException('Email already exists');
    }

    // Generate OTP and hash it
    const otp = this.generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    // Hash password before storing anywhere
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Store OTP hash in Redis (5 minutes TTL)
    await this.redis.set(
      `otp:signup:${dto.email}`,
      otpHash,
      'EX',
      300,
    );

    // Store signup payload (email + passwordHash)
    await this.redis.set(
      `signup:payload:${dto.email}`,
      JSON.stringify({
        email: dto.email,
        passwordHash,
      }),
      'EX',
      300,
    );

    // Send OTP via email (abstracted)
    await this.emailService.sendOtp(dto.email, otp);

    this.logger.log(`OTP sent successfully to ${dto.email}`);

    return { message: 'OTP sent to email' };
  }

  /**
   * STEP 2: Verify OTP
   * - Validate OTP
   * - Create user in DB
   * - Cleanup Redis keys
   */
  async verifyOtp(dto: VerifyOtpDto) {
    this.logger.log(`OTP verification attempt for ${dto.email}`);

    // Fetch OTP hash
    const otpHash = await this.redis.get(`otp:signup:${dto.email}`);
    if (!otpHash) {
      this.logger.warn(`OTP expired or missing for ${dto.email}`);
      throw new BadRequestException('OTP expired');
    }

    // Compare OTP
    const isValidOtp = await bcrypt.compare(dto.otp, otpHash);
    if (!isValidOtp) {
      this.logger.warn(`Invalid OTP attempt for ${dto.email}`);
      throw new BadRequestException('Invalid OTP');
    }

    // Fetch signup payload
    const payload = await this.redis.get(`signup:payload:${dto.email}`);
    if (!payload) {
      this.logger.error(`Signup payload missing for ${dto.email}`);
      throw new BadRequestException('Signup session expired');
    }

    const { email, passwordHash } = JSON.parse(payload);

    // Final DB write (only after OTP verification)
    const user = this.userRepo.create({
      email,
      passwordHash,
      loginType: LoginType.PASSWORD,
      isVerified: true,
      isActive: true,
    });

    await this.userRepo.save(user);

    // Cleanup Redis keys
    await this.redis.del(`otp:signup:${dto.email}`);
    await this.redis.del(`signup:payload:${dto.email}`);

    this.logger.log(`User successfully verified and created (${dto.email})`);

    return { message: 'User verified & registered' };
  }

  /**
   * PASSWORD LOGIN
   * - Only allowed for PASSWORD users
   * - User must be verified
   */
  async login(dto: LoginDto) {
    this.logger.log(`Login attempt for ${dto.email}`);

    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      this.logger.warn(`Login failed: user not found (${dto.email})`);
      throw new UnauthorizedException();
    }

    if (user.loginType !== LoginType.PASSWORD) {
      this.logger.warn(`Login blocked: wrong login method (${dto.email})`);
      throw new UnauthorizedException('Use Google login');
    }

    if (!user.isVerified) {
      this.logger.warn(`Login blocked: user not verified (${dto.email})`);
      throw new UnauthorizedException('Account not verified');
    }

    const isValidPassword = await bcrypt.compare(
      dto.password,
      user.passwordHash!,
    );

    if (!isValidPassword) {
      this.logger.warn(`Invalid password attempt for ${dto.email}`);
      throw new UnauthorizedException();
    }

    this.logger.log(`Login successful for ${dto.email}`);
    return this.issueToken(user);
  }

  /**
   * GOOGLE LOGIN
   * - Email is trusted after Google verification (frontend responsibility here)
   * - No password involved
   */
  async googleLogin(email: string) {
    this.logger.log(`Google login attempt for ${email}`);

    let user = await this.userRepo.findOne({ where: { email } });

    if (user && user.loginType !== LoginType.GOOGLE) {
      this.logger.warn(`Google login blocked: password account exists (${email})`);
      throw new UnauthorizedException('Use password login');
    }

    if (!user) {
      user = this.userRepo.create({
        email,
        loginType: LoginType.GOOGLE,
        isVerified: true,
        isActive: true,
      });

      await this.userRepo.save(user);
      this.logger.log(`New Google user created (${email})`);
    }

    return this.issueToken(user);
  }

  /**
   * JWT issuance
   * - Keep payload minimal
   * - Never store sensitive data
   */
  private issueToken(user: User) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
