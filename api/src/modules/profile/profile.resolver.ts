import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { ActiveUser } from '../iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { ProfileInput } from './dtos/profile.input';
import { ProfileDto } from './dtos/profile.dto';

@Resolver()
@Auth(AuthType.Bearer)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => ProfileDto)
  async updateProfile(
    @Args('input') input: ProfileInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.profileService.updateProfile(input, user);
  }
}
