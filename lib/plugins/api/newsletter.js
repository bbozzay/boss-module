export class ElasticMail {
    constructor({ apiBaseUrl, publicAccountID }, params) {
        this.apiBaseUrl = apiBaseUrl || "https://api.elasticemail.com/v2/";
        this.publicAccountID = publicAccountID
    }
    init() {
        if (!this.apiBaseUrl) {
            throw "Elastic apiBaseUrl missing or invalid"
        }
        if (!this.publicAccountID) {
            throw "publicAccountID required"
        }
        return this;
    }
    contactAdd(params) {
        return new Promise(async(resolve, reject) => {
            try {
                let requestUrl = this.apiBaseUrl + "contact/add";
                if (!params.email) throw "Email required";
                const args = {
                    publicAccountID: this.publicAccountID,
                    ...params
                }
                const response = await fetch(requestUrl + "?" + new URLSearchParams(args), {
                    method: "POST"
                })
                const data = await response.json();
                return resolve(data)
            } catch (err) {
                console.log("contactAdd error", err)
                return reject(err)
            }
        })
    }
}