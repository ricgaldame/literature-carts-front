import { boot } from 'quasar/wrappers'
import { supabase } from 'src/supabase.config';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( { app, /*router, ...*/ }) => {
  app.config.globalProperties.$supabase = supabase;
})
