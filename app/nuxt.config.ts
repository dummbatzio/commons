// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      GQL_HOST: "http://localhost:5000/graphql", // overwritten by process.env.GQL_HOST
    },
    session: {
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  },
  modules: [
    "nuxt-graphql-client",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "nuxt-auth-utils",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  "graphql-client": {
    codegen: true,
    clients: {
      default: {
        host: process.env.GQL_HOST || "http://localhost:5000/graphql",
        headers: {
          "Content-Type": "application/json",
        },
      },
    },
  },
});
