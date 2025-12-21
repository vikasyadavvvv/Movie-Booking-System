import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Screen } from '../../screens/entities/screen.entity';

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Screen, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'screen_id' })
  screen: Screen;

  @Column()
  seatNumber: string; // A1, B2 etc

  @Column()
  seatType: string; // REGULAR, PREMIUM
}
