import { Module } from '@nestjs/common';
import { ShowseatService } from './showseat.service';
import { ShowseatController } from './showseat.controller';

@Module({
  controllers: [ShowseatController],
  providers: [ShowseatService],
})
export class ShowseatModule {}
