import { UserSession } from "#auth-utils";

export default defineEventHandler(async (event) => {
  const session: UserSession = await getUserSession(event);
  const { refreshToken: token } = session.secure || {};

  try {
    if (!token) {
      return await clearUserSession(event);
    }

    const { refreshTokens } = await GqlRefreshTokens({ token });
    const { accessToken, refreshToken } = refreshTokens;

    await setUserSession(event, {
      accessToken,
      secure: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err: any) {
    const { errors } = err.response;
    const { originalError } = errors[0]?.extensions;

    throw createError({
      message: originalError.error,
      statusCode: originalError.statusCode,
      statusMessage: originalError.message,
    });
  }
});
