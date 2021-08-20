import base64url from 'base64url'
import fetch from 'node-fetch'

let debug = process.env.DEBUG && process.env.DEBUG !== "false" ? true : false;

export const encodeState = (path) => {
  const encodedUrl = base64url(path)
  return encodedUrl
}
export const decodeState = (route) => {
  if (!route.hash) { return false }
  const splitUrl = route.hash.split('&')
  const stateEntry = splitUrl.filter(part => part.includes('state'))
  if (!stateEntry.length > 0) { return false }
  const stateValue = stateEntry[0].substring(stateEntry[0].indexOf('=') + 1)
  if (!stateValue) { return false }
  const parsedUrl = base64url.decode(stateValue)
  return parsedUrl
}

export class Lambda {
  constructor () {

  }

  // Post or Get to netlify functions
  static async lambdaGet (endPoint, token, params) {
    const startTime = new Date()
    if (debug) {
      console.log(endPoint, token)
    }
    try {
      const response = await fetch(endPoint + '?' + new URLSearchParams(params), {
        headers: {
          Authorization: token
        }
      })
      const json = await response.json()
      if (!response.ok) { throw json }
      if (debug) {
        console.log('lambdaGet ' + (new Date() - startTime) + 's', endPoint, response.status, response, json)
      }
      return Promise.resolve(json)
    } catch (err) {
      if (debug) {
        console.warn(err)
      }
      return Promise.reject(err)
    }
  }

  static async lambdaPost (endPoint, token, body = null) {
    const startTime = new Date()
    try {
      if (debug) {
        console.log('lambdaPost', endPoint, body)
      }
      const response = await fetch(endPoint, {
        method: 'POST',
        headers: {
          Authorization: token
        },
        body: JSON.stringify(body)
      })
      const json = await response.json()
      if (!response.ok) { throw json }
      if (debug) {
        console.log('lambdaPost ' + (new Date() - startTime) + 's', endPoint, response.status, response, json)
      }
      return Promise.resolve(json)
    } catch (err) {
      if (debug) {
        console.warn(err)
      }
      return Promise.reject(err)
    }
  }
}
