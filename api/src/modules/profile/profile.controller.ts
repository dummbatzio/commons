import { Controller, Param, Patch } from '@nestjs/common';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { ProfileService } from './profile.service';

@Auth(AuthType.None)
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch(':id/verify')
  async verifyUserProfile(@Param('id') id: string) {
    return await this.profileService.verify(id);
  }
}
