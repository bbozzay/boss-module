import Middleware from '../middleware'
const options = JSON.parse('<%= JSON.stringify(options) %>')

// Init Middleware
Middleware.boss = async ({ route }) => {
  if (process.server) {
    return
  }
  if (options.debug) {
    // console.log("BOSS MIDDLEWARE", route.meta)
  }
}
Middleware['boss/requireLogin'] = async (context) => {
  if (process.server) {
    return
  }
  const { route, $boss, $auth } = context
  if (options.debug) {
    console.log('Middleware::boss/requireLogin', route)
  }
  if ($auth.loggedIn) { return }
  // simply console logging here to demonstrate access to app context.
  // $boss.redirect("/")
  return $boss.redirect(`/login?redirect_url=${route.path}`)
}
Middleware['boss/requireAnyRole'] = async (context) => {
  if (process.server) {
    return
  }
  const { route, $boss, from } = context
  if (options.debug) {
    console.log('Middleware::boss/requireAnyRole', route)
  }
  const roles = await $boss.getUserRoles()
  if (roles && roles.length > 0) { return }
  // simply console logging here to demonstrate access to app context.
  // $boss.redirect("/")
  return $boss.redirect(from)
}

Middleware['boss/requireRole'] = async (context) => {
  if (process.server) {
    return
  }
  const { route, $boss, from } = context
  if (options.debug) {
    console.log('Middleware::boss/requireRole', route)
  }
  const metaRole = route.meta.filter(meta => meta.role);
  const role =  metaRole && metaRole.length > 0 ? route.meta[0].role : options.roles.default;
  console.log("Requireing Role", role, route)
  const hasRole = await $boss.hasRole(role)
  if (hasRole) return;
  return $boss.redirect(from)
}