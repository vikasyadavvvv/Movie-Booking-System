import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserRole } from '../../common/enum/role.enum';
import { LoginType } from '../../common/enum/login.status.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ type: 'text', nullable: true })
  passwordHash: string | null;

  @Column({
    type: 'enum',
    enum: LoginType,
    default: LoginType.PASSWORD,
  })
  loginType: LoginType;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

   @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
