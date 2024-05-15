import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "@apollo/client/utilities";
import { cancelRequestLink } from "./cancel-apollo-request";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from "graphql-ws";


const httpLink = createUploadLink({
  uri:'/api/graphql/',  // instead of declaring this uri in a static case we should only get the uri path. it will automatically resolve whichever endpoint/domain it was hosted
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:9092/subscription',
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  cancelRequestLink.concat(httpLink),
);

const graphqlClient = new ApolloClient({
  // uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
  link: splitLink,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  queryDeduplication: false,
});

export { graphqlClient };
