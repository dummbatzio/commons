export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      status: 400,
      statusMessage: "Bad Request",
    });
  }

  try {
    const { signIn } = await GqlSignInUser({ input: body });
    const { accessToken, refreshToken, user } = signIn;

    await setUserSession(event, {
      user,
      accessToken,
      secure: {
        accessToken,
        refreshToken,
      },
      loggedInAt: new Date(),
    });

    return user;
  } catch (err: any) {
    console.log(err);
    const { errors } = err.response;
    const { originalError } = errors[0]?.extensions;

    throw createError({
      message: originalError.error,
      statusCode: originalError.statusCode,
      statusMessage: originalError.message,
    });
  }
});
