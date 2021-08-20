import { NetlifyJwtVerifier, claimToArray } from '@serverless-jwt/netlify'
require('dotenv').config()
// console.log(process.env.AUTH0_AUDIENCE)
// console.log(process.env.AUTH0_DOMAIN)
export const requireAuth = NetlifyJwtVerifier({
  issuer: 'https://' + process.env.AUTH0_DOMAIN + '/',
  // issuer: "https://devboss.us.auth0.com/",
  audience: process.env.AUTH0_AUDIENCE,
  // audience: "https://devboss/v1/authorize/",
  mapClaims: (claims) => {
    const user = claims
    user.scope = claimToArray(user.scope)
    return user
  }
})
