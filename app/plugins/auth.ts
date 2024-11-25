export default defineNuxtPlugin(async (nuxtApp: any) => {
  const route = nuxtApp.$router.currentRoute.value;
  const { loggedIn, session, clear } = useUserSession();

  if (loggedIn.value) {
    useGqlToken(session.value.accessToken);
    try {
      await GqlMe();
    } catch (err: any) {
      const unauthorized = err.gqlErrors.some(
        (e: any) => e.extensions.code === "UNAUTHENTICATED"
      );
      if (unauthorized) {
        clear();

        if (
          (route.name as string).startsWith("app") ||
          (route.name as string).startsWith("account")
        ) {
          await navigateTo({
            path: "/auth/login",
            query: {
              from: route.path,
            },
          });
        }
      }
    }
  }
});
