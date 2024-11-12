import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrganizationDto } from './dtos/organization.dto';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { ActiveUser } from '../iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { OrganizationInput } from './dtos/organization.input';
import { OrganizationMemberDto } from './dtos/organization-member.dto';
import { OrganizationMemberInput } from './dtos/organization-member.input';
import { OrganizationService } from './organization.service';

@Auth(AuthType.Bearer)
@Resolver()
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Query(() => [OrganizationDto], { name: 'myOrganizations' })
  async findMyOrganizations(@ActiveUser() user: ActiveUserData) {
    return this.organizationService.findOrganizationsByUser(user);
  }

  @Mutation(() => OrganizationDto, { name: 'createOrganization' })
  async createOrganization(
    @Args('input') input: OrganizationInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.organizationService.createOrganization(input, user);
  }

  @Mutation(() => OrganizationDto, { name: 'updateOrganization' })
  async updateOrganization(
    @Args('input') input: OrganizationInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.organizationService.updateOrganization(input, user);
  }

  @Mutation(() => OrganizationMemberDto, { name: 'addOrganizationMember' })
  async addOrganizationMember(
    @Args('input') input: OrganizationMemberInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.organizationService.addOrganizationMember(input, user);
  }

  @Mutation(() => OrganizationMemberDto, { name: 'updateOrganizationMember' })
  async updateOrganizationMember(
    @Args('input') input: OrganizationMemberInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.organizationService.updateOrganizationMember(input, user);
  }

  @Mutation(() => OrganizationMemberDto, { name: 'removeOrganizationMember' })
  async removeOrganizationMember(
    @Args('input') input: OrganizationMemberInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.organizationService.removeOrganizationMember(input, user);
  }
}
