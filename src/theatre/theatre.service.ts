import { Injectable } from '@nestjs/common';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { UpdateTheatreDto } from './dto/update-theatre.dto';

@Injectable()
export class TheatreService {
  create(createTheatreDto: CreateTheatreDto) {
    return 'This action adds a new theatre';
  }

  findAll() {
    return `This action returns all theatre`;
  }

  findOne(id: number) {
    return `This action returns a #${id} theatre`;
  }

  update(id: number, updateTheatreDto: UpdateTheatreDto) {
    return `This action updates a #${id} theatre`;
  }

  remove(id: number) {
    return `This action removes a #${id} theatre`;
  }
}
