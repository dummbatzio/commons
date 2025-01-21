import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './organization.entity';
import { OrganizationMember } from './organization-member.entity';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';
import { FileModule } from '../file/file.module';
import { WalletModule } from '../wallet/wallet.module';
import Agent from 'src/common/entities/agent.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent, Organization, OrganizationMember]),
    forwardRef(() => UserModule),
    FileModule,
    forwardRef(() => WalletModule),
  ],
  providers: [OrganizationResolver, OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
