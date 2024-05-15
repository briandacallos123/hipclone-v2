import { GraphQLError } from "graphql";
import { scalarType } from "nexus";



export const Upload = scalarType({
    name: "Upload",
    asNexusMethod: "upload",
    description: "desc",
    serialize: () => {
      throw new GraphQLError("Upload serialization unsupported.");
    },
    parseValue: async (value) => {
      const file: any = await value;
      return file;
    },
    parseLiteral: () => {
      throw new GraphQLError("Upload literal unsupported.");
    },
  });