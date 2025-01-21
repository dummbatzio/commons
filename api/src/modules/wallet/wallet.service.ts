import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { WalletTransactionInput } from './dtos/wallet-transaction.input';
import { TransactionType } from './enums/transaction-type.enum';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => OrganizationService))
    private readonly organizationService: OrganizationService,
  ) {}

  async getWalletByUserId(id: string) {
    const user = await this.userService.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.findOneBy({
      id: user.wallet.id,
    });
  }

  async getWalletByOrganizationId(id: string) {
    const org = await this.organizationService.getOrganizatonById(id);
    if (!org) {
      throw new NotFoundException('Organization not found.');
    }

    return this.findOneBy({
      id: org.wallet.id,
    });
  }

  async findOneBy(
    where: FindOptionsWhere<Wallet> | FindOptionsWhere<Wallet>[],
  ) {
    return await this.walletRepository.findOne({
      relations: ['transactions'],
      where,
    });
  }

  async createEmptyWallet() {
    const emptyWallet = await this.walletRepository.create();
    await this.walletRepository.save(emptyWallet);
    return emptyWallet;
  }

  async getBalance(wallet: Wallet) {
    return wallet.transactions.reduce((sum, tx) => {
      if (tx.type === TransactionType.TRANSFER_IN) {
        return sum + tx.amount;
      }

      return (sum = tx.amount);
    }, 0);
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
