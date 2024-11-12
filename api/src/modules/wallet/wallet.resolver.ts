import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { WalletService } from './wallet.service';
import { WalletTransactionDto } from './dtos/wallet-transaction.dto';
import { ActiveUser } from '../iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { WalletTransactionInput } from './dtos/wallet-transaction.input';

@Auth(AuthType.Bearer)
@Resolver()
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Mutation(() => WalletTransactionDto, { name: 'donate' })
  async donate(
    @Args('input') input: WalletTransactionInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    // return this.walletService.donate(input, user);
  }
}
