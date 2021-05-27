// middleware/index.js
import Middleware from '../../middleware'
import requireLogin from './access/requireLogin';
import requireRole from './access/requireRole';
const options = JSON.parse(`<%= JSON.stringify(options) %>`)
const { namespace } = options
Middleware[namespace] = async context => {
  if (process.server) {
      return
  }
  const { route, store, app, from, $boss, $auth } = context
  // simply console logging here to demonstrate access to app context.
  if (from) {
    store.commit(`${namespace}/redirectUrl`, from.path)
  }
}

Middleware[`${namespace}/requireLogin`] = context => {
  if (process.server) {
      return
  }
  const { redirect, $auth, route } = context
  // simply console logging here to demonstrate access to app context.
  console.log("context", context)
  return requireLogin({options, $auth, redirect, route});
}

Middleware[`${namespace}/requireRole`] = context => {
  if (process.server) {
      return
  }
  const { route, store, app, from, redirect, $boss } = context
  // simply console logging here to demonstrate access to app context.
  console.log("middleware::requireRole")
  return requireRole({options, namespace, route, store, app, from, redirect, $boss});
}