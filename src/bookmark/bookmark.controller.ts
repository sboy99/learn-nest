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
  findOne(@Param('id') id: string) {
    return this.bookmarkService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.update(+id, updateBookmarkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarkService.remove(+id);
  }
}
