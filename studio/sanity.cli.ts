import { defineCliConfig } from "sanity/cli"

export default defineCliConfig({
  api: {
    projectId: "3d2gmnv9",
    dataset: "production",
  },
  typegen: {
    path: "../sanity/**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "../sanity.types.ts",
  },
})
