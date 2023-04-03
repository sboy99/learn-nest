import { DatabaseService } from '@/database/database.service';
import { IJwtUser } from '@/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(bookmarkId: Bookmark['id']): Promise<Bookmark> {
    const bookmark = await this.db.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) throw new NotFoundException('No bookmark found');
    return bookmark;
  }

  update(id: Bookmark['id'], updateBookmarkDto: UpdateBookmarkDto) {
    return `This action updates a #${id} bookmark`;
  }

  remove(id: Bookmark['id']) {
    return `This action removes a #${id} bookmark`;
  }
}
