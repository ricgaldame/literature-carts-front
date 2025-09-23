import type { ApolloClientOptions } from '@apollo/client/core';
import { createHttpLink, InMemoryCache } from '@apollo/client/core';
import type { BootFileParams } from '@quasar/app';
import { useIdentityStore } from 'src/stores/identityStore';
import { storeToRefs } from 'pinia';
import { setContext } from '@apollo/client/link/context';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { userAuth } from 'src/identity/userAuth';

const isRefreshNeeded = (token?: string | null) => {
  if (!token) {
    return { valid: false, needRefresh: true };
  }

  const decoded = jwt_decode<JwtPayload>(token);

  if (!decoded) {
    return { valid: false, needRefresh: true };
  }
  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    return { valid: false, needRefresh: true };
  }
  return { valid: true, needRefresh: false };
}

const apolloAuthLink = setContext(async (request, { headers }) => {
  const store = useIdentityStore();
  const { getToken } = storeToRefs(store);
  const { setToken, setAttributes } = store;
  const { refreshSession } = userAuth();

  // console.log('request.operationName', request.operationName);
  // console.log('operationName', request)  

  if (getToken.value.length > 0) {
    if(isRefreshNeeded(getToken.value).needRefresh){
      try {
        await refreshSession();

        const h =  {
          headers: {
            ...headers,
            authorization: `${getToken.value}`,
          }
        }
        
        // console.log('apolloAuthLink: ', h);
        return h;

      }
      catch(error: any){
        setAttributes(null);
        setToken('');
        console.log(error.error);
        window.location.replace('/');
      } 
    }

    const h =  {
      headers: {
        ...headers,
        authorization: `Bearer ${getToken.value}`,
      }
    }

    // console.log('apolloAuthLink: ', h);
    return h;
  }

  const h = { 
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.SUPABASE_PUBLIC_ANON_KEY}`
    }
  };

  // console.log('apolloAuthLink: ', h);
  return h;
});

export /* async */ function getClientOptions(
  /* {app, router, ...} */ options?: Partial<BootFileParams<any>>
) {
  console.log('getClientOptions');
  const store = useIdentityStore();
  const { getToken } = storeToRefs(store);

  return <ApolloClientOptions<unknown>>Object.assign(
    // General options.
    <ApolloClientOptions<unknown>>{
      link: apolloAuthLink.concat(createHttpLink({
        uri: process.env.SUPABASE_FUNCTION_URL || ''
      })),
      
      cache: new InMemoryCache(),
      defaultOptions: {
        mutation: {
          timeout: 120000,
        },
      },
    },

    // Specific Quasar mode options.
    process.env.MODE === 'spa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'ssr'
      ? {
          //
        }
      : {},
    process.env.MODE === 'pwa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'bex'
      ? {
          //
        }
      : {},
    process.env.MODE === 'cordova'
      ? {
          //
        }
      : {},
    process.env.MODE === 'capacitor'
      ? {
          //
        }
      : {},
    process.env.MODE === 'electron'
      ? {
          //
        }
      : {},

    // dev/prod options.
    process.env.DEV
      ? {
          //
        }
      : {},
    process.env.PROD
      ? {
          //
        }
      : {},

    // For ssr mode, when on server.
    process.env.MODE === 'ssr' && process.env.SERVER
      ? {
          ssrMode: true,
        }
      : {},
    // For ssr mode, when on client.
    process.env.MODE === 'ssr' && process.env.CLIENT
      ? {
          ssrForceFetchDelay: 100,
        }
      : {}
  )
}
