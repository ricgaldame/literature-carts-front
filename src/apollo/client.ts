// src/apollo/client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

const authLink = setContext(async (_, { headers }) => {
  return { headers: { ...headers, authorization: `Bearer ${process.env.SUPABASE_PUBLIC_ANON_KEY}` } };;
});

const httpLink = createHttpLink({ uri: process.env.SUPABASE_FUNCTION_URL || '' });

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
