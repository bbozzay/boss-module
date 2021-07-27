// middleware/index.js
import Middleware from '../../middleware'
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
    // TODO: Make redirectUrl a setter on $boss
    // store.commit(`${namespace}/redirectUrl`, from.path)
    $boss.redirectUrl = from.path
  }
}

Middleware[`${namespace}/requireLogin`] = context => {
  if (process.server) {
    return
  }
  const { $boss, route } = context;
  // simply console logging here to demonstrate access to app context.
  // console.log("context", context)
  // console.log("require Login")
  return $boss.requireAuth("login", route.path);
}

Middleware[`${namespace}/requireSignup`] = context => {
  if (process.server) {
    return
  }
  const { $boss, route } = context;
  // simply console logging here to demonstrate access to app context.
  // console.log("context", context)
  // console.log("require signup")
  console.log("requireSignup", route.path)
  return $boss.requireAuth("signup", route.path);
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

Middleware[`${namespace}/logout`] = async context => {
  if (process.server) {
    return
  }
  const { $boss, from, app } = context
  // simply console logging here to demonstrate access to app context.
  await $boss.auth.logout();
}