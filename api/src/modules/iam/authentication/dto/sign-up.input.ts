import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsNotEmpty()
  @IsAlphanumeric()
  @Transform(({ value }: { value: string }) => value.trim())
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;
}
