import fetch from 'node-fetch';
const options = JSON.parse(`<%= JSON.stringify(options) %>`)
// extract the namespace from the options
const { apiBaseUrl, devMode } = options

const requestUrl = (path) => {
	return apiBaseUrl + path
}

// Post or Get to netlify functions
export const lambdaGet = (endPoint, token, params) => {
	return new Promise(async(resolve, reject) => {
		const startTime = new Date();
		try {
			const response = await fetch(requestUrl(endPoint) + "?" + new URLSearchParams(params), {
				headers: {
					authorization: token
				}
			});
			const json = await response.json();
			if (!response.ok) throw json
			if (devMode) {
				console.log("lambdaGet " + (new Date() - startTime) + "s", endPoint, response.status, response, json)
			}
			return resolve(json)
		} catch(err) {
			return reject(err)
		}
	})
}

export const lambdaPost = (endPoint, token, body) => {
	return new Promise(async(resolve, reject) => {
		const startTime = new Date();
		try {
			if (devMode) {
				console.log("lambdaPost", endPoint, body)
			}
			const response = await fetch(requestUrl(endPoint), {
				method: "POST",
				headers: {
					authorization: token
				},
				body: JSON.stringify(body)
			});
			const json = await response.json();
			if (!response.ok) throw json
			if (devMode) {
				console.log("lambdaPost " + (new Date() - startTime) + "s", endPoint, response.status, response, json)
			}
			return resolve(json)
		} catch(err) {
			console.warn(err)
			return reject(err)
		}
	})
}