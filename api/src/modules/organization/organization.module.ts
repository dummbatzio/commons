import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './organization.entity';
import { OrganizationMember } from './organization-member.entity';
import { OrganizationResolver } from './organization.resolver';
import { IamModule } from '../iam/iam.module';
import { ProfileModule } from '../profile/profile.module';
import { OrganizationService } from './organization.service';
import { FileModule } from '../file/file.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationMember]),
    IamModule,
    ProfileModule,
    FileModule,
    WalletModule,
  ],
  providers: [OrganizationResolver, OrganizationService],
})
export class OrganizationModule {}
