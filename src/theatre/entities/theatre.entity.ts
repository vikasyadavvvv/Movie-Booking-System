import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Screen } from '../../screens/entities/screen.entity';

@Entity('theatres')
export class Theatre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  location: string;

  @OneToMany(() => Screen, screen => screen.theatre)
  screens: Screen[];

  @CreateDateColumn()
  createdAt: Date;
}
