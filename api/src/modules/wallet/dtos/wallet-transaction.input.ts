import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { WalletDto } from './wallet.dto';

@InputType()
export class WalletTransactionInput {
  @Field(() => ID)
  public receiverWalletId: string;

  @Field(() => ID)
  public senderWalletId: string;

  @Field(() => Int)
  public amount: number;

  @Field({ nullable: true })
  public comment: string;
}
