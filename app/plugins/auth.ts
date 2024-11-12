export default defineNuxtPlugin(async (nuxtApp) => {
  const { loggedIn, session } = useUserSession();

  if (loggedIn.value) {
    // @ts-ignore
    useGqlToken(session.value.accessToken);
  }
});
