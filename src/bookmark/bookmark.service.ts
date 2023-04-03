import { DatabaseService } from '@/database/database.service';
import { IJwtUser } from '@/interfaces';
import { Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly db: DatabaseService) {}
  async create(
    createBookmarkDto: CreateBookmarkDto,
    userId: IJwtUser['userId'],
  ): Promise<Bookmark | never> {
    const bookmark = await this.db.bookmark.create({
      data: {
        user_id: userId,
        title: createBookmarkDto.title,
        description: createBookmarkDto.description,
        url: createBookmarkDto.url,
      },
    });

    return bookmark;
  }

  async findAll(): Promise<Bookmark[]> {
    const bookmarks = await this.db.bookmark.findMany({});
    return bookmarks;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookmark`;
  }

  update(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return `This action updates a #${id} bookmark`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookmark`;
  }
}
