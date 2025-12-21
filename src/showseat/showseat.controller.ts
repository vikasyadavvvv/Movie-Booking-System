import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShowseatService } from './showseat.service';
import { CreateShowseatDto } from './dto/create-showseat.dto';
import { UpdateShowseatDto } from './dto/update-showseat.dto';

@Controller('showseat')
export class ShowseatController {
  constructor(private readonly showseatService: ShowseatService) {}

  @Post()
  create(@Body() createShowseatDto: CreateShowseatDto) {
    return this.showseatService.create(createShowseatDto);
  }

  @Get()
  findAll() {
    return this.showseatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showseatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShowseatDto: UpdateShowseatDto) {
    return this.showseatService.update(+id, updateShowseatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showseatService.remove(+id);
  }
}
