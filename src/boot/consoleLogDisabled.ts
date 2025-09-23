import { boot } from 'quasar/wrappers'
import loglevel from 'loglevel'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
  loglevel.setLevel(process.env.STAGE=='dev' ? 'debug' : 'error', false);
  window.console = loglevel;
})
