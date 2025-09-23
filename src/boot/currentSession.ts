import { boot } from 'quasar/wrappers'
import { userAuth } from '../identity/userAuth';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( /* { app, router, ... } */) => {
  // something to do
  const { currentSession, refreshSession } = userAuth();

  try {
    const data = await currentSession();

    // if(!data.success){
    //   await refreshSession();
    // }
  }
  catch(error: any){
    console.log('(boot data) 👉', error.message);
  }
})