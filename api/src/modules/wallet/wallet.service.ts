import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { WalletTransactionInput } from './dtos/wallet-transaction.input';
import { TransactionType } from './enums/transaction-type.enum';

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

  async getWalletWithBalance(walletId: string) {
    const wallet = await this.walletRepository.findOne({
      relations: ['transactions'],
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found.');
    }

    wallet.balance = wallet.transactions.reduce((sum, tx) => {
      if (tx.type === TransactionType.TRANSFER_IN) {
        return sum + tx.amount;
      }

      return (sum = tx.amount);
    }, 0);

    return wallet;
  }

  async deposit(input: WalletTransactionInput) {
    const transaction = await this._prepareTransaction(input);
    transaction.type = TransactionType.TRANSFER_IN;

    await this.walletTransactionRepository.save(transaction);

    return transaction;
  }

  async charge(input: WalletTransactionInput) {
    const transaction = await this._prepareTransaction(input);
    transaction.type = TransactionType.TRANSFER_OUT;

    await this.walletTransactionRepository.save(transaction);

    return transaction;
  }

  protected async _prepareTransaction(input: WalletTransactionInput) {
    const { walletId, ...transactionData } = input;
    const wallet = await this.walletRepository.findOne({
      where: {
        id: walletId,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found.');
    }

    const transaction =
      await this.walletTransactionRepository.create(transactionData);
    transaction.wallet = wallet;

    return transaction;
  }
}
