import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Show } from '../../show/entities/show.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  title: string;

  @Column()
  durationMinutes: number;

  @Column()
  language: string;

  @Column('simple-array')
  genres: string[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Show, show => show.movie)
  shows: Show[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
