const userHasRequiredRole = (userRoles, requiredRole) => {
    if (!userRoles || userRoles.length == 0 || !requiredRole) return false;
    const allAccessRoles = ["premium", requiredRole];
    console.log("userHasRequiredRole", userRoles, requiredRole)
    // If user has no roles at all
    let i = 0;
    let hasRequiredRole = false;
    while (i < allAccessRoles.length) {
        let allowedRole = allAccessRoles[i];
        let matches = userRoles.filter(roles => allowedRole == roles.name);
        if (matches.length > 0) {
            hasRequiredRole = true;
            i = allAccessRoles.length;
            break;
        }
        i++;
    }
    return hasRequiredRole

}
module.exports = {
    userHasRequiredRole
}

module.exports = {
  userHasRequiredRole
}

