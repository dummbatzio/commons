import {
  forwardRef,
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './organization.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { OrganizationMember } from './organization-member.entity';
import { FileService } from '../file/file.service';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { OrganizationInput } from './dtos/organization.input';
import { OrganizationMemberInput } from './dtos/organization-member.input';
import { WalletService } from '../wallet/wallet.service';
import { AgentService } from 'src/common/services/agent.service';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { UserService } from '../user/user.service';
import User from '../user/user.entity';
import { OrganizationMemberRole } from './enums/organization-member-role.enum';

@Injectable()
export class OrganizationService implements AgentService<Organization> {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private organizationMemberRepository: Repository<OrganizationMember>,
    private readonly fileService: FileService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
  ) {}

  async getOrganizatonById(organizationId: string) {
    return this.findOneBy({
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
          user: {
            id: user.id,
          },
        },
      },
      relations: ['members'],
    });
  }

  async findOneBy(
    where: FindOptionsWhere<Organization> | FindOptionsWhere<Organization>[],
  ) {
    return await this.organizationRepository.findOne({
      where,
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

    const wallet = await this.walletService.createEmptyWallet();
    organization.wallet = wallet;

    await this.organizationRepository.save(organization);

    // add current user as organization admin
    await this._addOrganizationMember(user, organization, true);

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
        (m) =>
          m.user.id === adminUser.id && m.role === OrganizationMemberRole.ADMIN,
      )
    ) {
      const transformedInput = await this.transformInput(input);
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

    const member = await this.userService.findOneBy({ id: input.userId });
    if (!member) {
      throw new NotFoundException('Member not found.');
    }

    if (
      organization.members.find(
        (m) =>
          m.user.id === adminUser.id && m.role === OrganizationMemberRole.ADMIN,
      )
    ) {
      return await this._addOrganizationMember(
        member,
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
        user: { id: input.userId },
        organization: { id: input.organizationId },
      },
      relations: ['organization'],
    });
    if (!organizationMember) {
      throw new NotFoundException('Member not found.');
    }

    if (
      organizationMember.organization.members.find(
        (m) =>
          m.user.id === adminUser.id && m.role === OrganizationMemberRole.ADMIN,
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
        user: { id: input.userId },
        organization: { id: input.organizationId },
      },
      relations: ['organization'],
    });
    if (!organizationMember) {
      throw new NotFoundException('Member not found.');
    }

    if (
      organizationMember.organization.members.find(
        (m) =>
          m.user.id === adminUser.id && m.role === OrganizationMemberRole.ADMIN,
      )
    ) {
      return await this.organizationMemberRepository.delete(organizationMember);
    }

    throw new MethodNotAllowedException(
      'User is not allowed to remove member.',
    );
  }

  private async _addOrganizationMember(
    user: User,
    organization: Organization,
    isAdmin?: boolean,
  ) {
    const member = this.organizationMemberRepository.create({
      user,
      organization,
      ...(isAdmin ? { role: OrganizationMemberRole.ADMIN } : {}),
    });

    return this.organizationMemberRepository.save(member);
  }

  async transformInput(input: OrganizationInput) {
    const { avatarId, ...rest } = input;
    let transformedInput: any = rest;

    if (avatarId) {
      const avatar = await this.fileService.findOneById(avatarId);
      if (!avatar) {
        throw new NotFoundException('Cannot find Avatar.');
      }
      transformedInput = {
        ...transformedInput,
        avatar,
      };
    }

    return transformedInput;
  }

  async verify(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOneBy({
      id,
    });

    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    organization.status = VerificationStatus.VERIFIED;

    await this.organizationRepository.save(organization);

    return organization;
  }
}
