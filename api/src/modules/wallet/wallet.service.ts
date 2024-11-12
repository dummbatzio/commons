import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletTransaction } from './wallet-transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    // private readonly userService: UserService,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
  ) {}

  async createEmptyWallet() {
    const emptyWallet = await this.walletRepository.create();
    await this.walletRepository.save(emptyWallet);
    return emptyWallet;
  }

  // async donate(input: WalletTransactionInput, currentUser: ActiveUserData) {
  //   const senderUser = await this.userService.findOneBy({
  //     id: currentUser.sub,
  //   });
  //   if (!senderUser) {
  //     throw new NotFoundException('User not found.');
  //   }

  //   if (senderUser.profile.wallet.id !== input.senderWalletId) {
  //     // TODO: check if senderWalletId is from organization and currentUser is admin of it
  //     throw new MethodNotAllowedException('User is not allowed.');
  //   }

  //   const transaction = await this.walletTransactionRepository.create(input);
  //   return await this.walletTransactionRepository.save(transaction);
  // }
}
