import { Args, Mutation, Resolver } from '@nestjs/graphql';
// import { AuthType } from '../iam/authentication/enums/auth-type.enum';
// import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { WalletService } from './wallet.service';
import { WalletTransactionDto } from './dtos/wallet-transaction.dto';
import { WalletTransactionInput } from './dtos/wallet-transaction.input';

// @Auth(AuthType.Bearer)
@Resolver()
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Mutation(() => WalletTransactionDto, { name: 'deposit' })
  async deposit(@Args('input') input: WalletTransactionInput) {
    return this.walletService.deposit(input);
  }

  @Mutation(() => WalletTransactionDto, { name: 'charge' })
  async charge(@Args('input') input: WalletTransactionInput) {
    return this.walletService.charge(input);
  }
}
