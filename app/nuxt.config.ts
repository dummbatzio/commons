// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  experimental: {
    asyncContext: true,
  },
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "192x192",
          href: "/favicon-192.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "512x512",
          href: "/favicon-512.png",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      GQL_HOST: "http://localhost:5000/graphql", // overwritten by process.env.GQL_HOST
    },
    session: {
      maxAge: 60 * 60 * 24, // 1 day
    },
  },
  modules: [
    "nuxt-graphql-client",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "nuxt-auth-utils",
    "@nuxt/fonts",
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
