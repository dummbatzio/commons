import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class WalletTransactionInput {
  @Field(() => ID)
  public walletId: string;

  @Field(() => Int)
  public amount: number;

  @Field({ nullable: true })
  public comment: string;
}
