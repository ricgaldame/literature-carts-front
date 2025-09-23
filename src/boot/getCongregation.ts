import { boot } from 'quasar/wrappers'
import { getCongregation } from 'src/api/queries/getCongregation';
import { apolloClient } from 'src/apollo/client';
import { useCongregationStore } from 'src/stores/congregationStore';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( /* { app, router, ... } */) => {
  // something to do
  const store = useCongregationStore();
	const { setCongregation } = store;

  try {
    const { data: getCongregationData,  error: getCongregationError } = await apolloClient.query({
      query: getCongregation,
      variables: { code: process.env.CONGREGATION_CODE || '' },
    });

    // console.log(getCongregationData)

    if(getCongregationError) throw new Error(getCongregationError.message);

    setCongregation(getCongregationData.getCongregation.name)

  }
  catch(error: any){
    console.log('(boot data) 👉', error.message);
  }
})