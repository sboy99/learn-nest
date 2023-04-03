import { AccessTokenGuard } from '@/auth/guards';
import { User } from '@/decorators';
import { IJwtUser, IRes } from '@/interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @User('userId') userId: IJwtUser['userId'],
    @Body() createBookmarkDto: CreateBookmarkDto,
  ): Promise<IRes<Bookmark>> {
    const bookmark = await this.bookmarkService.create(
      createBookmarkDto,
      userId,
    );
    return {
      code: 'SUCCESS',
      message: 'Successfully created new bookmark',
      data: bookmark,
    };
  }
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<IRes<Bookmark[]>> {
    const bookmarks = await this.bookmarkService.findAll();
    return {
      code: 'SUCCESS',
      message: `Successfully found ${bookmarks.length} bookmarks`,
      data: bookmarks,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IRes<Bookmark>> {
    const bookmark = await this.bookmarkService.findOne(id);
    return {
      code: 'SUCCESS',
      message: 'Successfully found bookmark',
      data: bookmark,
    };
  }
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User('userId') userId: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ): Promise<IRes<Bookmark>> {
    const uBookmark = await this.bookmarkService.update(
      id,
      userId,
      updateBookmarkDto,
    );
    return {
      code: 'SUCCESS',
      message: 'Successfully updated bookmark',
      data: uBookmark,
    };
  }
  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @User('userId') userId: IJwtUser['userId'],
  ): Promise<IRes> {
    await this.bookmarkService.remove(id, userId);
    return {
      code: 'SUCCESS',
      message: ' Successfully deleted bookmark',
    };
  }
}
