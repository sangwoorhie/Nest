import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  ApiGetItemsResponse,
  ApiGetResponse,
} from 'src/common/decorator/swagger.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import {
  DeleteUserResDto,
  EditUserResDto,
  FindUserResDto,
} from './dto/res.dto';
import { PageReqDto } from 'src/common/dto/req.dto';
import { PageResDto } from 'src/common/dto/res.dto';
import { DeleteUserReqDto, EditUserReqDto } from './dto/req.dto';
import { User, UserAfterAuth } from 'src/common/decorator/user.decorator';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserRole } from './enum/user.enum';

@ApiTags('User')
@ApiExtraModels(FindUserResDto, PageReqDto, PageResDto)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 유저 목록조회
  @ApiBearerAuth()
  @ApiGetItemsResponse(FindUserResDto)
  @Roles(UserRole.Admin) // 관리자만 조회가능
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '유저 목록조회' })
  @Get()
  async findAll(
    @Query() { page, size }: PageReqDto,
    @User() user: UserAfterAuth,
  ): Promise<{ items: FindUserResDto[] }> {
    const users = await this.userService.findAll(page, size);
    return { items: users.map((user) => FindUserResDto.toDto(user)) };
  }

  // 유저 1명 조회 (이메일로 조회)
  @ApiBearerAuth()
  @ApiGetResponse(FindUserResDto)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'E-mail 유저조회' })
  @Get('/:email')
  async findUserByEmail(
    @Query('email') email: string,
  ): Promise<FindUserResDto> {
    const user = await this.userService.findUserByEmail(email);
    return FindUserResDto.toDto(user);
  }

  // 회원 정보 수정
  @ApiBearerAuth()
  @ApiGetResponse(EditUserResDto)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '회원정보 수정' })
  @Patch()
  async updateUser(
    @Body() { confirmPassword, newPassword, name }: EditUserReqDto,
    @User() user: UserAfterAuth,
  ): Promise<EditUserResDto> {
    const updatedUser = await this.userService.updateUser(
      confirmPassword,
      newPassword,
      name,
      user,
    );
    return EditUserResDto.toDto(updatedUser);
  }

  // 회원 탈퇴
  @ApiBearerAuth()
  @ApiGetResponse(DeleteUserResDto)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '회원탈퇴' })
  @Delete()
  async deleteUser(
    @Body() { confirmPassword }: DeleteUserReqDto,
    @User() user: UserAfterAuth,
  ): Promise<DeleteUserResDto> {
    await this.userService.deleteUser(confirmPassword, user);
    return new DeleteUserResDto(user.id);
  }
}
