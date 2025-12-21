import { Seat } from '../../seats/entities/seat.entity';
import { Theatre } from '../../theatre/entities/theatre.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Show } from '../../show/entities/show.entity';


@Entity('screens')
export class Screen {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Theatre, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'theatre_id' })
    theatre: Theatre;

    @Column()
    name: string;

    @Column()
    totalSeats: number;

    // store seat layout (rows, columns, type)
    @Column({ type: 'jsonb' })
    seatLayout: any;

    @OneToMany(() => Seat, seat => seat.screen)
    seats: Seat[];

    @OneToMany(() => Show, show => show.screen)
    shows: Show[];
}
