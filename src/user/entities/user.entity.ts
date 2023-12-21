import { Video } from 'src/video/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { UserRole } from '../enum/user.enum';
import { RefreshToken } from 'src/auth/entities/refreshToken.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('user-Email-idx')
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Normal,
    // nullable: true,
  })
  role: UserRole;

  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedat' })
  updatedAt: Date;

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;
}
