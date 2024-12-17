import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { WalletTransactionDto } from './wallet-transaction.dto';

@ObjectType()
export class WalletDto extends BaseAuditDto {
  @Field(() => Int)
  public balance: number;

  @Field(() => [WalletTransactionDto], { nullable: true })
  public transactions: WalletTransactionDto[];
}
