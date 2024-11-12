import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseDto } from 'src/common/dtos/base.dto';

@ObjectType()
export class WalletDto extends BaseDto {
  @Field(() => Int)
  public balance: number;
}
