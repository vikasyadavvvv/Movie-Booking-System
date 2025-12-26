import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './users.service';
import { AuthController } from './users.controller';
import { User } from './entities/user.entity';
import { RedisModule } from '../redis/redis.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    RedisModule,                   
    JwtModule,  
    EmailModule                
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class UsersModule {}
