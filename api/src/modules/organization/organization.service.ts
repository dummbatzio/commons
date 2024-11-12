import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../iam/user/user.service';
import { Organization } from './organization.entity';
import { Repository } from 'typeorm';
import { OrganizationMember } from './organization-member.entity';
import { FileService } from '../file/file.service';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { OrganizationInput } from './dtos/organization.input';
import { Profile } from '../profile/profile.entity';
import { OrganizationMemberInput } from './dtos/organization-member.input';
import { ProfileService } from '../profile/profile.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private organizationMemberRepository: Repository<OrganizationMember>,
    private readonly fileService: FileService,
    private readonly walletService: WalletService,
  ) {}

  async getOrganizatonById(organizationId: string) {
    return await this.organizationRepository.findOneBy({
      id: organizationId,
    });
  }

  async findOrganizationsByUser(currentUser: ActiveUserData) {
    const user = await this.userService.findOneBy({ id: currentUser.sub });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return await this.organizationRepository.find({
      where: {
        members: {
          profile: {
            id: user.profile.id,
          },
        },
      },
      relations: ['members'],
    });
  }

  async createOrganization(
    input: OrganizationInput,
    currentUser: ActiveUserData,
  ) {
    const user = await this.userService.findOneBy({ id: currentUser.sub });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const organization = this.organizationRepository.create(input);
    const emptyWallet = await this.walletService.createEmptyWallet();
    organization.wallet = emptyWallet;

    await this.organizationRepository.save(organization);

    // add current user as organization admin
    await this._addOrganizationMember(user.profile, organization, true);

    return await this.getOrganizatonById(organization.id);
  }

  async updateOrganization(
    input: OrganizationInput,
    currentUser: ActiveUserData,
  ) {
    const adminUser = await this.userService.findOneBy({ id: currentUser.sub });
    if (!adminUser) {
      throw new NotFoundException('User not found.');
    }

    const organization = await this.organizationRepository.findOne({
      where: { id: input.id },
      relations: ['members'],
    });
    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    if (
      organization.members.find(
        (m) => m.profile.id === adminUser.profile.id && m.isAdmin,
      )
    ) {
      const transformedInput = await this._transformInput(input);
      Object.assign(organization, transformedInput);
      await this.organizationRepository.save(organization);

      return organization;
    }

    throw new MethodNotAllowedException(
      'User is not allowed to update organization.',
    );
  }

  async addOrganizationMember(
    input: OrganizationMemberInput,
    currentUser: ActiveUserData,
  ) {
    const adminUser = await this.userService.findOneBy({ id: currentUser.sub });
    if (!adminUser) {
      throw new NotFoundException('User not found.');
    }

    const organization = await this.organizationRepository.findOne({
      where: { id: input.organizationId },
      relations: ['members'],
    });
    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    const memberProfile = await this.profileService.getById(input.profileId);
    if (!memberProfile) {
      throw new NotFoundException('Member profile not found.');
    }

    if (
      organization.members.find(
        (m) => m.profile.id === adminUser.profile.id && m.isAdmin,
      )
    ) {
      return await this._addOrganizationMember(
        memberProfile,
        organization,
        input.isAdmin,
      );
    }

    throw new MethodNotAllowedException('User is not allowed to add member.');
  }

  async updateOrganizationMember(
    input: OrganizationMemberInput,
    currentUser: ActiveUserData,
  ) {
    const adminUser = await this.userService.findOneBy({ id: currentUser.sub });
    if (!adminUser) {
      throw new NotFoundException('User not found.');
    }

    const organizationMember = await this.organizationMemberRepository.findOne({
      where: {
        profile: { id: input.profileId },
        organization: { id: input.organizationId },
      },
      relations: ['organization'],
    });
    if (!organizationMember) {
      throw new NotFoundException('Member not found.');
    }

    if (
      organizationMember.organization.members.find(
        (m) => m.profile.id === adminUser.profile.id && m.isAdmin,
      )
    ) {
      Object.assign(organizationMember, input);
      await this.organizationMemberRepository.save(organizationMember);

      return organizationMember;
    }

    throw new MethodNotAllowedException(
      'User is not allowed to update member.',
    );
  }

  async removeOrganizationMember(
    input: OrganizationMemberInput,
    currentUser: ActiveUserData,
  ) {
    const adminUser = await this.userService.findOneBy({ id: currentUser.sub });
    if (!adminUser) {
      throw new NotFoundException('User not found.');
    }

    const organizationMember = await this.organizationMemberRepository.findOne({
      where: {
        profile: { id: input.profileId },
        organization: { id: input.organizationId },
      },
      relations: ['organization'],
    });
    if (!organizationMember) {
      throw new NotFoundException('Member not found.');
    }

    if (
      organizationMember.organization.members.find(
        (m) => m.profile.id === adminUser.profile.id && m.isAdmin,
      )
    ) {
      return await this.organizationMemberRepository.delete(organizationMember);
    }

    throw new MethodNotAllowedException(
      'User is not allowed to remove member.',
    );
  }

  private async _addOrganizationMember(
    profile: Profile,
    organization: Organization,
    isAdmin?: boolean,
  ) {
    const member = this.organizationMemberRepository.create({
      profile,
      organization,
      isAdmin,
    });

    return this.organizationMemberRepository.save(member);
  }

  private async _transformInput(input: OrganizationInput) {
    const { profileImageId, ...rest } = input;
    let profileImage = null;

    if (profileImageId) {
      profileImage = await this.fileService.findOneById(profileImageId);
      if (!profileImage) {
        throw new NotFoundException('Cannot find Profile Image.');
      }
    }

    return {
      ...rest,
      profileImage,
    };
  }
}
