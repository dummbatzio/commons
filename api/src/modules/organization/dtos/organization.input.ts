import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class OrganizationInput {
  @IsOptional()
  @Field(() => ID, { nullable: true })
  public id: string;

  @Field()
  public name: string;

  @IsOptional()
  @Field({ nullable: true })
  public description: string;

  @IsOptional()
  @Field(() => ID, { nullable: true })
  public profileImageId: string;

  // @IsOptional()
  // @Field({ nullable: true })
  // public memberProfiles: ProfileDto[];
}
