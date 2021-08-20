import { Lambda } from '../lib/utils'
import { Stripe } from '../lib/strategies'

import fetch from 'node-fetch';
const apiUrl = process.env.BASEURL
const absEndpoint = (endpoint) => apiUrl + "/.netlify/functions/" + endpoint;

const testCustomerId = "cus_K19aeNW7P4QPgo";
// /oauth/token
let _token = null;
let data = {
		grant_type: "http://auth0.com/oauth/grant-type/password-realm",
		client_id: process.env.AUTH0_CLIENT_ID,
		client_secret: process.env.AUTH0_SECRET,
		audience: process.env.AUTH0_AUDIENCE,
		username: "local+ben@techlockdown.com",
		password: process.env.AUTH0_TEST_PASSWORD,
		realm: "test-db"
	}
const testUserLogin = async() => {
	if (_token) {
		return Promise.resolve(_token)
	}
	let response = await fetch("https://" + process.env.AUTH0_DOMAIN + "/oauth/token", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	})
	let decoded = await response.json()
	// Bearer 
	_token = decoded.token_type + " " + decoded.access_token
	return testUserLogin();
}


describe("Auth0 token", () => {
	it("Get a token with basicAuth", async()=> {
		let token = await testUserLogin();	
		console.log("token endpoint", token)
		expect(token)
	})
})
describe('Stripe Checks', () => {
	let context = {
    route: "/products",
    baseUrl: process.env.BASEURL,
    path: "/products",
    email: "test+local+ben@techlockdown.com"
	}
	let config = {
    apiUrl: absEndpoint(""),
		token: null,
		customer_id: testCustomerId
	}
  // const getEndpoint = "http://api.publicapis.org/entries";
  it('Return 100 products with no filtering', async () => {
		const ss = new Stripe(context, config);
		let p = await ss.productsList()
    expect(p.data.length > 0)
  })

	const testGuideProduct = {
		product_id: "prod_K1SHCnI2nGCkn2",
		price_id: "price_1JNPNIGfnawpNTlrD1OLuiwg"
	}
//?product=prod_K1SHCnI2nGCkn2&price=price_1JNPNIGfnawpNTlrD1OLuiwg
  // it('Find a product within customer invoices', async () => {
	// 	config.token = await testUserLogin()
	// 	const ss = new Stripe(context, config);
	// 	let invoices = await ss.invoicesList()
	// 	// console.log(invoices)
	// 	// let p = await ss.checkInvoicesForProduct(invoices, testGuideProduct.price_id, testGuideProduct.product_id)
  //   // expect(p.data.length > 0)
  // })
})