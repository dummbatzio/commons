import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import User from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { AgentService } from 'src/common/services/agent.service';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { UserInput } from './dto/user.input';
import { FileService } from 'src/modules/file/file.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService implements AgentService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly fileService: FileService,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(user);

    const wallet = await this.walletService.createEmptyWallet();
    newUser.wallet = wallet;

    await this.userRepository.save(newUser);

    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneBy(where: any): Promise<User | null> {
    return this.userRepository.findOne({
      where,
    });
  }

  async findOneByOrFail(where: any): Promise<User | null> {
    return this.userRepository.findOneOrFail({
      where,
    });
  }

  async verify(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    user.status = VerificationStatus.VERIFIED;

    await this.userRepository.save(user);

    return user;
  }

  async transformInput(input: UserInput) {
    const { avatarId, ...rest } = input;
    let avatar = null;

    if (avatarId) {
      avatar = await this.fileService.findOneById(avatarId);
      if (!avatar) {
        throw new NotFoundException('Cannot find Avatar Image.');
      }
    }

    return {
      ...rest,
      avatar,
    };
  }
}
