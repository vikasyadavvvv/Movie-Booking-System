import { Injectable } from '@nestjs/common';
import { CreateShowseatDto } from './dto/create-showseat.dto';
import { UpdateShowseatDto } from './dto/update-showseat.dto';

@Injectable()
export class ShowseatService {
  create(createShowseatDto: CreateShowseatDto) {
    return 'This action adds a new showseat';
  }

  findAll() {
    return `This action returns all showseat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} showseat`;
  }

  update(id: number, updateShowseatDto: UpdateShowseatDto) {
    return `This action updates a #${id} showseat`;
  }

  remove(id: number) {
    return `This action removes a #${id} showseat`;
  }
}
