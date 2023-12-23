import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/routes/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty({ description: '비디오 제목' })
  title: string;

  @Column()
  @ApiProperty({ description: 'MIME 타입' })
  mimetype: string;

  @Column({ name: 'downloadCount', default: 0 })
  @ApiProperty({ description: '비디오 다운로드 횟수' })
  downloadCount: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.videos)
  @JoinColumn({ name: 'userId' })
  user: User;
}
