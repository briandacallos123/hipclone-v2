import { makeSchema } from "nexus";
import path from "path";
import * as types from "./types";

const schema = makeSchema({
  types,
  outputs: {
    typegen: path.join(process.cwd(), "generated/nexus-typegen.ts"),
    schema: path.join(process.cwd(), "generated/schema.graphql"),
  },
  // contextType: {
  //   module: path.join(process.cwd(), "prisma/context.ts"),
  //   export: "Context",
  // },
  sourceTypes: {
    modules: [{ module: ".prisma/client", alias: "PrismaClient" }],
    debug: false,
  },
});

export default schema;
