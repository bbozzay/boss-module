var ManagementClient = require('auth0').ManagementClient;
// Create a management API with certain permissions\
const { init } = require("../../helpers/management");
// Create a management API with certain permissions
var management = new ManagementClient(init("update:users read:users read:roles read:user_idp_tokens"));

module.exports = {
    management
}