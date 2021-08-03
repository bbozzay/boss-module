// Create a management API with certain permissions
import { init } from './permissions/helpers/management'
const ManagementClient = require('auth0').ManagementClient
export const management = new ManagementClient(init('read:users read:users_app_metadata'))
