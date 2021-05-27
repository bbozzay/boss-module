export default async({options, route, $boss, app}) => {
    if (process.server) {
        return
    }
    const userRoles = await $boss.fetchUserRoles();
    if (!userRoles) {
        // User is loggedIn but needs to signup
        app.router.push({
            path: `${options.paths.signup}?redirectUrl=${route.path}`
        })
    }
    let allowedRoles = route.meta && route.meta.requireRole ? route.meta.requireRole : options.requireRole.default;
    Array.isArray(allowedRoles) ? allowedRoles = allowedRoles : allowedRoles = [allowedRoles]
    const supportedRoles = ["premium", ...allowedRoles];
    let hasRole = false;
    // fetchUserRoles
    // let currentUserRoles = ["pagespeed-premium"]
    for (let i = 0; i < supportedRoles.length; i++) {
        let matched = userRoles.filter(userRole => supportedRoles[i] == userRole.name);
        matched.length > 0 ? hasRole = true : false;
    }
    if (!hasRole) {
        app.router.push({
            path: `${options.paths.signup}?redirectUrl=${route.path}`
        })
    }
}