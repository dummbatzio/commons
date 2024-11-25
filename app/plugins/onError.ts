export default defineNuxtPlugin(() => {
  useGqlError((err: any) => {
    // Only log during development
    if (process.env.NODE_ENV !== "production") {
      for (const gqlError of err.gqlErrors) {
        console.error("[nuxt-graphql-client] [GraphQL error]", {
          client: err.client,
          statusCode: err.statusCode,
          operationType: err.operationType,
          operationName: err.operationName,
          gqlError,
        });
      }
    }

    const unauthorized = err.gqlErrors.some(
      (e: any) => e.extensions.code === "UNAUTHENTICATED"
    );
    if (unauthorized) {
      // clear();
    }
  });
});
