var ManagementClient = require('auth0').ManagementClient;
// Create a management API with certain permissions
const { init } = require("../../helpers/management");
var management = new ManagementClient(init("read:users read:users_app_metadata"));

module.exports = {
    management
}