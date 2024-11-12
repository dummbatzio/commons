import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const { req } = gqlCtx.getContext();
    const user: ActiveUserData | undefined = req[REQUEST_USER_KEY];

    return field ? user?.[field] : user;
  },
);
