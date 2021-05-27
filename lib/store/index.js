// store/index.js
import auth from './modules/auth'
import user from './modules/user'
import access from './modules/access'
// import redirectModule from './modules/redirect'
// get the options out using lodash templates
const options = JSON.parse(`<%= JSON.stringify(options) %>`)
// extract the namespace var
const { namespace } = options
// create the plugin
export default async({ store }, inject) => {
  // register the module using namespace as the name.
  // counter module takes the options object and returns an object that is a
  // vuex store defenition
  store.registerModule(namespace, auth(options), {
    // preserveState: Boolean(store.state[namespace]) // if the store module already exists, preserve it
  })
  store.registerModule([namespace, "user"], user(options), {
    // preserveState: Boolean(store.state[`${namespace}/user`]) // if the store module already exists, preserve it
  })
  store.registerModule([namespace, "access"], access(options), {
    // preserveState: Boolean(store.state[`${namespace}/access`]) // if the store module already exists, preserve it
  })
  // store.registerModule([namespace, "auth"], redirectModule(options), {
  //   preserveState: Boolean(store.state[`${namespace}/auth`]) // if the store module already exists, preserve it
  // })
  // store.registerModule([namespace, "redirect"], redirectModule(options), {
  //   preserveState: Boolean(store.state[`${namespace}/redirect`]) // if the store module already exists, preserve it
  // })
}