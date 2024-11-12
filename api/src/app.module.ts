import { Module } from '@nestjs/common';
import { IamModule } from './modules/iam/iam.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './common/database/redis.module';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './common/database/database.module';
import { ProfileModule } from './modules/profile/profile.module';
import { join } from 'path';
import { FileModule } from './modules/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { OrganizationModule } from './modules/organization/organization.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
    DatabaseModule,
    RedisModule,
    IamModule,
    ProfileModule,
    FileModule,
    OrganizationModule,
    WalletModule,
    TaskModule,
  ],
})
export class AppModule {}
