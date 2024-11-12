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
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { UserService } from '../iam/user/user.service';
import { ProfileInput } from './dtos/profile.input';
import { FileService } from '../file/file.service';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { WalletService } from '../wallet/wallet.service';

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

  async createEmptyProfile(): Promise<Profile> {
    const emptyProfile = await this.profileRepository.create();
    const emptyWallet = await this.walletService.createEmptyWallet();
    emptyProfile.wallet = emptyWallet;

    await this.profileRepository.save(emptyProfile);

    return emptyProfile;
  }

  async verify(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOneBy({
      id,
    });

    if (!profile) {
      throw new NotFoundException('Profile not found.');
    }

    profile.status = VerificationStatus.VERIFIED;

    await this.profileRepository.save(profile);

    return profile;
  }

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

    const transformedInput = await this.transformInput(input);
    Object.assign(profile, transformedInput);
    await this.profileRepository.save(profile);

    return profile;
  }

  private async transformInput(input: ProfileInput) {
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
