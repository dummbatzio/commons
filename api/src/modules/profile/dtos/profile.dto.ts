import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { ProfileType } from '../enums/profile-type.enum';
import { WalletDto } from 'src/modules/wallet/dtos/wallet.dto';

@ObjectType()
export class ProfileDto extends BaseAuditDto {
  @Field()
  public type: ProfileType;

  @Field({ nullable: true })
  public wallet: WalletDto;
}
