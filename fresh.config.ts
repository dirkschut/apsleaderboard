import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { sessionPlugin } from "@5t111111/fresh-session";

export default defineConfig({
  plugins: [
    tailwind(),
    sessionPlugin({
      // Key must be at least 32 characters long.
      encryptionKey: "thisistempxxxxxxxxxxxxxxxxxxxxxx",
      // Optional; the session does not expire if not provided.
      expireAfterSeconds: 3600,
      // Optional; default is "session".
      sessionCookieName: "aps_sessions",
      // Optional; see https://jsr.io/@std/http/doc/cookie/~/Cookie
      cookieOptions: { path: "/", secure: true, sameSite: "Lax" },
    }),
  ],
});
