import { createYoga } from "graphql-yoga";
import { getSession } from "next-auth/react";
import { useDisableIntrospection } from '@graphql-yoga/plugin-disable-introspection';
import { blockFieldSuggestionsPlugin } from '@escape.tech/graphql-armor-block-field-suggestions';
import schema from "src/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { PubSub } from 'graphql-subscriptions';
import getRawBody from 'raw-body'; // You might need to install this package

export const config = {
  api: {
    bodyParser: false,
  },
};

const pubsub = new PubSub();

const yoga = createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  context: async ({ req }) => ({ session: await getSession({ req }) }),
  schema: () => schema,
 /*  plugins: [useDisableIntrospection(), blockFieldSuggestionsPlugin()], */
  graphiql: true,
  /* graphiql: {
    defaultQuery: `query User { users { 
      firstName
      lastName
      email
     } }`,
  }, */
  graphqlEndpoint: "/api/graphql/",
});

export default yoga;
