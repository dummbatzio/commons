import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Transform(({ value }: { value: string }) => value.trim())
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
