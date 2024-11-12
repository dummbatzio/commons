export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, email, password } = body;

  if (!username || !email || !password) {
    throw createError({
      status: 400,
      statusMessage: "Bad Request",
    });
  }

  try {
    const { signUp } = await GqlSignUpUser({ input: body });

    return signUp;
  } catch (err: any) {
    throw createError({
      status: err.statusCode,
      statusMessage: err.message,
    });
  }
});
