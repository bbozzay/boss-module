var ManagementClient = require('auth0').ManagementClient;
const { init } = require("../../helpers/management");
// Create a management API with certain permissions
var management = new ManagementClient(init("read:users read:roles read:user_idp_tokens"));

module.exports = {
    management
}