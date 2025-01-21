import { Field, ID, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { AgentInput } from 'src/common/dtos/agent.input';

@InputType()
export class UserInput extends AgentInput {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Transform(({ value }: { value: string }) => value.trim())
  @Field({ nullable: true })
  username: string;

  @IsEmail()
  @Field({ nullable: true })
  email: string;

  @MinLength(8)
  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  public firstname: string;

  @Field({ nullable: true })
  public lastname: string;

  @Field({ nullable: true })
  public bio: string;
}
