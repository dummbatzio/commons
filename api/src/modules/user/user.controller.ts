import { Controller, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id/verify')
  async verify(@Param('id') id: string) {
    return await this.userService.verify(id);
  }
}
