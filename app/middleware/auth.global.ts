export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();

  if (
    ["/auth/login", "/auth/register", "/auth/forgot-password"].includes(
      to.path
    ) &&
    loggedIn.value
  ) {
    return navigateTo("/");
  }

  if (!loggedIn.value && to.path.startsWith("/app")) {
    return navigateTo("/auth/login");
  }
});
