import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { TransactionType } from '../enums/transaction-type.enum';

@ObjectType()
export class WalletTransactionDto extends BaseAuditDto {
  @Field()
  public type: TransactionType;

  @Field(() => Int)
  public amount: number;

  @Field({ nullable: true })
  public comment: string;
}
