import { GraphQLError } from "graphql/error/GraphQLError";
import { extendType } from "nexus";
import { useUpload } from '../../hooks/use-upload';
export const SimpleUpload = extendType({
    type: "Mutation",
    definition(t) {
      t.field("simpleUpload", {
        type: 'String',
        args: { file: 'Upload', userId: 'String'},
        async resolve(_, args, _ctx) {
          const sFile = await args.file;
          console.log(sFile)
           
          const upload =  useUpload(sFile, 'public/uploads/')

           return JSON.stringify(upload)
        },
      });
    },
  });
