import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Show } from '../../show/entities/show.entity';
import { Seat } from '../../seats/entities/seat.entity';
import { Booking } from '../../booking/entities/booking.entity';

export enum ShowSeatStatus {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED',
  BOOKED = 'BOOKED',
}

@Entity('show_seats')
@Unique(['show', 'seat'])
@Index(['show', 'status'])              // seat availability queries
@Index(['booking', 'status'])           // booking → seats lookup (NEW)
export class ShowSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Show, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'show_id' })
  show: Show;

  @ManyToOne(() => Seat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @Column({
    type: 'enum',
    enum: ShowSeatStatus,
    default: ShowSeatStatus.AVAILABLE,
  })
  status: ShowSeatStatus;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil: Date | null;

  @ManyToOne(() => Booking, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking | null;
}
