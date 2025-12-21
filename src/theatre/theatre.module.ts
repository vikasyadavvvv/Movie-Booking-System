import { Module } from '@nestjs/common';
import { TheatreService } from './theatre.service';
import { TheatreController } from './theatre.controller';

@Module({
  controllers: [TheatreController],
  providers: [TheatreService],
})
export class TheatreModule {}
