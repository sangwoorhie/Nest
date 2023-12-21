import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entities/refreshToken.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  // 1. 회원가입
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
    // 비밀번호 해싱
    const hashedPassword = await this.userService.hashPassword(password);

    // 회원가입 시 액세스토큰, 리프레시토큰은 둘다 '동시에' 발급되어야 하므로 트랜잭션 처리.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let error;
    try {
      // 동일이메일 존재유무 확인
      const user = await this.userService.findUserByEmail(email);
      if (user) throw new BadRequestException('이미 존재하는 이메일입니다.');

      // 유저 생성후 DB에 저장
      const userEntity = queryRunner.manager.create(User, {
        email,
        password: hashedPassword,
        name,
      });
      await queryRunner.manager.save(userEntity);

      // 액세스토큰, 리프래시토큰 생성 후 리프래시토큰 DB에 저장
      const accessToken = this.generateAccessToken(userEntity.id);
      const refreshToken = this.generateRefreshToken(userEntity.id);
      const refreshTokenEntity = queryRunner.manager.create(RefreshToken, {
        user: { id: userEntity.id },
        token: refreshToken,
      });
      await queryRunner.manager.save(refreshTokenEntity);
      await queryRunner.commitTransaction();
      return { id: userEntity.id, accessToken, refreshToken };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      error = err;
    } finally {
      await queryRunner.release(); // 쿼리러너 종료
      if (error) throw error;
    }
  }

  // 2. 로그인
  async signin(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const refreshToken = await this.generateRefreshToken(user.id);
    await this.createRefreshTokenUsingUser(user.id, refreshToken);

    return {
      accessToken: this.generateAccessToken(user.id),
      refreshToken,
    };
  }

  // 유저 유효성 검사
  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (!user)
      throw new UnauthorizedException('해당 회원이 존재하지 않습니다.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('잘못된 비밀번호입니다.');

    return user;
  }

  // 엑세스토큰 발급
  private generateAccessToken(userid: string) {
    const payload = { sub: userid, tokenType: 'access' };
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  // 리프레시토큰 발급
  private generateRefreshToken(userid: string) {
    const payload = { sub: userid, tokenType: 'refresh' };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  // DB에 저장해서 리프레시토큰 영속성 유지 (리프래시토큰 있으면 갱신, 없으면 새로운 엔티티 생성 저장)
  private async createRefreshTokenUsingUser(
    userId: string,
    refreshToken: string,
  ) {
    let refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      user: { id: userId },
    });

    // if 이미 리프레시토큰을 발급받은 경우 / else 그렇지 않은경우
    if (refreshTokenEntity) {
      refreshTokenEntity.token = refreshToken;
    } else {
      refreshTokenEntity = this.refreshTokenRepository.create({
        user: { id: userId },
        token: refreshToken,
      });
      await this.refreshTokenRepository.save(refreshTokenEntity);
    }
  }

  // 3. 로그인 시 리프레시토큰 발급 (로그인을 대신해서 클라이언트에서 전달하는 refreshToken으로 진행하는 API)
  async refresh(token: string, userId: string) {
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      token,
    });
    if (refreshTokenEntity) throw new BadRequestException();
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    // 리프레시토큰 DB저장
    refreshTokenEntity.token = refreshToken;
    await this.refreshTokenRepository.save(refreshTokenEntity);
    return { accessToken, refreshToken };
  }
}
