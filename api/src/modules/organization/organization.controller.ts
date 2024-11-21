import { Controller, Param, Patch } from '@nestjs/common';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { OrganizationService } from './organization.service';

@Auth(AuthType.None)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Patch(':id/verify')
  async verify(@Param('id') id: string) {
    return await this.organizationService.verify(id);
  }
}
