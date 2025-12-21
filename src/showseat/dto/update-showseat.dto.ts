import { PartialType } from '@nestjs/mapped-types';
import { CreateShowseatDto } from './create-showseat.dto';

export class UpdateShowseatDto extends PartialType(CreateShowseatDto) {}
