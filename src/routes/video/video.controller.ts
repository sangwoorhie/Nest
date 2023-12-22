import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { VideoService } from './video.service';
import {
  ApiGetItemsResponse,
  ApiGetResponse,
  ApiPostResponse,
} from 'src/common/decorator/swagger.decorator';
import { CreateVideoReqDto, FindVideoReqDto } from './dto/req.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CreateVideoResDto, FindVideoResDto } from './dto/res.dto';
import { User, UserAfterAuth } from 'src/common/decorator/user.decorator';
import { PageReqDto } from 'src/common/dto/req.dto';
import { ThrottlerBehindProxyGuard } from 'src/common/guard/throttler-behind-proxy.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreateVideoCommand } from './command/create-video.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindVideosQuery } from './query/find.videos.query';

@ApiTags('Video')
@ApiExtraModels(
  CreateVideoReqDto,
  CreateVideoResDto,
  FindVideoReqDto,
  FindVideoResDto,
)
@UseGuards(ThrottlerBehindProxyGuard) // Throttler가드 전역 적용
@Controller('videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  // 비디오 생성(업로드)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiPostResponse(CreateVideoResDto)
  @ApiOperation({ summary: '비디오 업로드' })
  @Post()
  async upload(
    @Body() createVideoReqDto: CreateVideoReqDto,
    @User() user: UserAfterAuth,
  ): Promise<CreateVideoResDto> {
    const { title, video } = createVideoReqDto;
    const command = new CreateVideoCommand(
      user.id,
      title,
      'video/mp4',
      'mp4',
      Buffer.from(''),
    );
    // commandBus 실행, createVideoHandler에서 반환된 video의 id
    const { id } = await this.commandBus.execute(command);
    return { id, title };
  }

  // @UseInterceptors(FileInterceptor('video'))
  // async create(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: 'mp4',
  //       })
  //       .addMaxSizeValidator({
  //         maxSize: 5 * 1024 * 1024,
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //       }),
  //   )
  //   file: Express.Multer.File,
  //   @Body() { title }: CreateVideoReqDto,
  //   @User() { id }: UserAfterAuth,
  // ): Promise<CreateVideoResDto> {
  //   const { mimetype, originalname, buffer } = file;
  //   const extension = originalname.split('.')[1];
  //   const video = await this.videoService.create(
  //     id,
  //     title,
  //     mimetype,
  //     extension,
  //     buffer,
  //   );
  //   return CreateVideoResDto.toDto(video);
  // }

  // 비디오 목록조회
  @ApiBearerAuth()
  @ApiGetItemsResponse(FindVideoResDto)
  @SkipThrottle() // ThrottlerBehindProxyGuard 적용 안받음.
  @ApiOperation({ summary: '비디오 목록조회' })
  @Get()
  async findAll(
    @Query() { page, size }: PageReqDto,
  ): Promise<FindVideoResDto[]> {
    const findVidesoQuery = new FindVideosQuery(page, size);
    // queryBus 실행, findVideo 쿼리실행
    const videos = await this.queryBus.execute(findVidesoQuery);
    return videos.map(({ id, title, user }) => {
      return {
        id,
        title,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    });
  }

  // @ApiBearerAuth()
  // @SkipThrottle() // ThrottlerBehindProxyGuard 적용 안받음.
  // @ApiGetItemsResponse(FindVideoResDto)
  // @ApiOperation({ summary: '비디오 목록조회' })
  // @Get()
  // async findAll(
  //   @Query() { page, size }: PageReqDto,
  // ): Promise<{ items: FindVideoResDto[] }> {
  //   const videos = await this.videoService.findAll(page, size);
  //   return { items: videos.map((video) => FindVideoResDto.toDto(video)) };
  // }

  // 비디오 ID로 찾기
  @ApiBearerAuth()
  @ApiOperation({ summary: '비디오 상세조회' })
  @ApiGetResponse(FindVideoResDto)
  @Get(':id')
  async findOne(@Param() { id }: FindVideoReqDto) {
    const video = await this.videoService.findOne(id);
    return FindVideoResDto.toDto(video);
  }

  // 비디오 다운로드
  @ApiBearerAuth()
  // @Throttle(3, 60) // 60초동안 3번만 다운가능하도록 허용
  @ApiOperation({ summary: '비디오 다운로드' })
  @Get(':id/download')
  async play(
    // @Headers('Sec-Fetch-Dest') setFetchDest: 'document' | 'video',
    @Param() { id }: FindVideoReqDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { stream, mimetype, size } = await this.videoService.download(id);
    res.set({
      'Content-Length': size,
      'Content-Type': mimetype,
      // attachment인 경우 호출을 한번만 하게 되지만 비디오를 다운로드 하게 됨
      'Content-Disposition': 'attachment;',
    });
    return new StreamableFile(stream);
  }
}
