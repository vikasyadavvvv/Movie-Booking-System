import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Screen } from '../../screens/entities/screen.entity';
import { ShowStatus } from '../../common/enum/show-status.enum';

@Entity('shows')
export class Show {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, movie => movie.shows, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Screen, screen => screen.shows, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'screen_id' })
  screen: Screen;

  @Column({ type: 'timestamp' })
  @Index()
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: ShowStatus,
    default: ShowStatus.UPCOMING,
  })
  status: ShowStatus;
}
