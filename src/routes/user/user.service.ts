import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DeleteUserResDto } from './dto/res.dto';
import { UserRole } from './enum/user.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // 유저 목록조회
  async findAll(page: number, size: number) {
    const users = this.userRepository.find({
      skip: (page - 1) * size,
      take: size,
    });
    return users;
  }

  // 유저 1명 조회 (이메일로 조회, authService와 연결)
  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new NotFoundException('해당 이메일의 회원이 존재하지 않습니다.');
    return user;
  }

  // 회원 정보 수정
  async updateUser(
    confirmPassword: string,
    newPassword: string,
    name: string,
    user,
  ): Promise<User> {
    const comparedPassword = await bcrypt.compare(
      confirmPassword,
      user.password,
    );
    if (!comparedPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    const newPw = await this.hashPassword(newPassword);

    await this.userRepository.update(
      { id: user.id },
      { password: newPw, name },
    );
    return this.userRepository.findOne({ where: { id: user.id } });
  }

  // 회원 탈퇴
  async deleteUser(confirmPassword: string, user): Promise<any> {
    const comparedPassword = await bcrypt.compare(
      confirmPassword,
      user.password,
    );
    if (!comparedPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    await this.userRepository.softDelete({ id: user.id });
    return new DeleteUserResDto(user.id);
  }

  // 관리자 조회 (jwt-auth.Guard와 연결)
  async checkUserIsAdmin(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user.role === UserRole.Admin;
  }

  // 비밀번호 해싱
  async hashPassword(password: string): Promise<string> {
    const saltRounds = process.env.BCRYPT_SALT;
    return await bcrypt.hash(password, saltRounds);
  }
}
