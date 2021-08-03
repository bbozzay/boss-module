import { NetlifyJwtVerifier, claimToArray } from '@serverless-jwt/netlify'
require('dotenv').config()

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
