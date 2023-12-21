import { Video } from 'src/video/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enum/user.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Normal })
  role: UserRole;

  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedat' })
  updatedAt: Date;

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];
}
