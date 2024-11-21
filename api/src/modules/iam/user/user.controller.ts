import { Controller, Param, Patch } from '@nestjs/common';
import { AuthType } from '../authentication/enums/auth-type.enum';
import { Auth } from '../authentication/decorators/auth.decorator';
import { UserService } from './user.service';

@Auth(AuthType.None)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id/verify')
  async verify(@Param('id') id: string) {
    return await this.userService.verify(id);
  }
}
