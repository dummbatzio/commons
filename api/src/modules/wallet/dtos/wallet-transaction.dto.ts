import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { WalletDto } from './wallet.dto';

@ObjectType()
export class WalletTransactionDto extends BaseAuditDto {
  @Field()
  public receiver: WalletDto;

  @Field({nullable: true})
  public sender: WalletDto;

  @Field(() => Int)
  public amount: number;

  @Field({ nullable: true })
  public comment: string;
}
