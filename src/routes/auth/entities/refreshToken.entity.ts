import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/routes/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty({ description: '토큰' })
  token: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.refreshToken)
  @JoinColumn({ name: 'userId' })
  user: User;
}
