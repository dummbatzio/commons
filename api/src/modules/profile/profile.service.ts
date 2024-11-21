import {
  forwardRef,
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { UserService } from '../iam/user/user.service';
import { ProfileInput } from './dtos/profile.input';
import { FileService } from '../file/file.service';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { WalletService } from '../wallet/wallet.service';
import { ProfileType } from './enums/profile-type.enum';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly fileService: FileService,
    private readonly walletService: WalletService,
  ) {}

  async getById(profileId: string) {
    return await this.profileRepository.findOneBy({
      id: profileId,
    });
  }

  async createEmptyProfile(type: ProfileType): Promise<Profile> {
    const emptyProfile = await this.profileRepository.create({
      type,
    });
    const emptyWallet = await this.walletService.createEmptyWallet();
    emptyProfile.wallet = emptyWallet;

    await this.profileRepository.save(emptyProfile);

    return emptyProfile;
  }

  // MIGHT NOT BE NEEDED ANYMORE
  async updateProfile(
    input: ProfileInput,
    currentUser: ActiveUserData,
  ): Promise<Profile> {
    const user = await this.userService.findOneBy({ id: currentUser.sub });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const { profile } = user;

    if (profile.id !== input.id) {
      throw new MethodNotAllowedException(
        'User is not allowed to update this profile.',
      );
    }

    Object.assign(profile, input);
    await this.profileRepository.save(profile);

    return profile;
  }
}
