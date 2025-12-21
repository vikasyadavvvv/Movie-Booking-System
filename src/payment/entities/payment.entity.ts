import { Booking } from '../../booking/entities/booking.entity';
import { PaymentStatus } from '../../common/enum/payment-status.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'booking_id' })
  @Index()
  booking: Booking;

  @Column({ unique: true })
  @Index()
  idempotencyKey: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.INITIATED,
  })
  status: PaymentStatus;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
