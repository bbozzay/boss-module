const requireBody = async (body, keys) => {
	return new Promise((resolve, reject) => {

	let i = 0;
	if (!keys || !body) return reject("Missing Request Body")
	while(keys.length > 0) {
		let exists = body.hasOwnProperty(keys[i]) && body[keys[i]];
		console.log("checking key", exists)
		if (!exists) {
			reject("Missing required key: ", keys[i])
			break;
			
		}
		keys.pop();
		i++
	}
	return resolve()

	})
}

module.exports = {
	requireBody
}