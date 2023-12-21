import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // 회원가입
  async signup(
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
  ) {
    if (password !== confirmPassword)
      throw new BadRequestException(
        '비밀번호와 확인 비밀번호가 일치하지 않습니다.',
      );
    const user = await this.userService.findUserByEmail(email);
    if (user) throw new BadRequestException('이미 존재하는 이메일입니다.');
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const newUser = await this.userService.signup(email, hashedPassword, name);
    return newUser;
  }

  // 로그인
  async signin(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user)
      throw new UnauthorizedException('해당 회원이 존재하지 않습니다.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('잘못된 비밀번호입니다.');

    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }
}
