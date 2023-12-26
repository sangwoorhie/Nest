import { Video } from 'src/routes/video/entities/video.entity';
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
import { RefreshToken } from 'src/routes/auth/entities/refreshToken.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('user-Email-idx')
  @ApiProperty({ description: '이메일' })
  @Column({ unique: true })
  email: string;

  @Column()
  @ApiProperty({ description: '비밀번호' })
  password: string;

  @Column()
  @ApiProperty({ description: '이름' })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Normal,
    // nullable: true,
  })
  @ApiProperty({ description: '신분' })
  role: UserRole;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;
}
