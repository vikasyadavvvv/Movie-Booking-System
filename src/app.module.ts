import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseLogger } from './database/database.provider';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { TheatreModule } from './theatre/theatre.module';
import { ScreensModule } from './screens/screens.module';
import { ShowModule } from './show/show.module';
import { SeatsModule } from './seats/seats.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';
import { ShowseatModule } from './showseat/showseat.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),

    UsersModule,

    MoviesModule,

    TheatreModule,

    ScreensModule,

    ShowModule,

    SeatsModule,

    BookingModule,

    PaymentModule,

    ShowseatModule,

    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService,DatabaseLogger],
})
export class AppModule {}
