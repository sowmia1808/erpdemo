import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic", // keep this as Prisma default engine
  datasource: {
    url: env("DATABASE_URL"),
  },
});
