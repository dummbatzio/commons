import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WalletService } from './wallet.service';
import { WalletTransactionDto } from './dtos/wallet-transaction.dto';
import { WalletTransactionInput } from './dtos/wallet-transaction.input';
import { WalletDto } from './dtos/wallet.dto';
import { ActiveUser } from '../iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Auth } from '../iam/authentication/decorators/auth.decorator';

@Auth(AuthType.Bearer)
@Resolver()
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Query(() => WalletDto, { name: 'myWallet' })
  async getCurrentUserWallet(@ActiveUser() currentUser: ActiveUserData) {
    const wallet = await this.walletService.getWalletByUserId(currentUser.sub);
    return {
      ...wallet,
      ...(wallet ? { balance: this.walletService.getBalance(wallet) } : {}),
    };
  }

  @Query(() => WalletDto, { name: 'userWallet' })
  async getUserWallet(@Args('userId') userId: string) {
    const wallet = await this.walletService.getWalletByUserId(userId);
    return {
      ...wallet,
      ...(wallet ? { balance: this.walletService.getBalance(wallet) } : {}),
    };
  }

  @Query(() => WalletDto, { name: 'organizationWallet' })
  async getOrganizationWallet(@Args('organizationId') organizationId: string) {
    const wallet =
      await this.walletService.getWalletByOrganizationId(organizationId);
    return {
      ...wallet,
      ...(wallet ? { balance: this.walletService.getBalance(wallet) } : {}),
    };
  }

  @Mutation(() => WalletTransactionDto, { name: 'deposit' })
  async deposit(@Args('input') input: WalletTransactionInput) {
    return this.walletService.deposit(input);
  }

  @Mutation(() => WalletTransactionDto, { name: 'charge' })
  async charge(@Args('input') input: WalletTransactionInput) {
    return this.walletService.charge(input);
  }
}
