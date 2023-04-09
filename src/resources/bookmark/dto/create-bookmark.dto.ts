import { Trim } from '@/decorators';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBookmarkDto {
  @Trim()
  @MinLength(2, {
    message: 'Title is too short',
  })
  @MaxLength(50, {
    message: 'Title is too long',
  })
  @IsString({
    message: 'Title should be a string',
  })
  @IsNotEmpty({
    message: 'Title should not be empty',
  })
  title: string;

  @Trim()
  @MinLength(15, {
    message: 'Description should have atleast 15 chars',
  })
  @IsString({
    message: 'Description should be a string',
  })
  @IsNotEmpty({
    message: 'Description should not be empty',
  })
  description: string;

  @Trim()
  @IsString({
    message: 'URl should be a string',
  })
  url?: string;
}
