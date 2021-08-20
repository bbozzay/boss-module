// import "./vendors";
import delay from 'delay';
import { Stripe, Auth0 } from './strategies';
import * as utils from './utils';



class Boss {
	constructor(context, options) {
		this.$auth = context.$auth;
		this.ctx = context;
		this.store = context.store;
		this.options = options;
		this.debug = options.debug;
		this.route = context.route;
		// Auth0 has associated lambda functions
		this.authStrategy = options.authStrategy;
		this.checkoutStrategy = options.checkoutStrategy;
		// If localStorage exists but the user was never
		this._userSynced = false;
		this._userFetchedOnce = false;
		this._rolesFetchedOnce = false;
		this._subscriptionsFetchedOnce = false;
		//this.cart = new Storage(context);
		if (this.debug && process.client) {
			console.log("class Boss Context", this.ctx)
		}
	}
	get userFetchedOnce() {
		return this._userFetchedOnce
	}
	get rolesFetchedOnce() {
		return this._rolesFetchedOnce
	}
	get subscriptionsFetchedOnce() {
		return this._subscriptionsFetchedOnce
	}
	get storage() {
		return new utils.Storage(this.ctx)
	}
	get cart() {
		return new utils.Cart(this.ctx)
	}
	get token() {
		return this.$auth.strategy.token.get()
	}
	async customer_id(strategy = this.checkoutStrategy) {
		let user = await this.getUserMeta();
		if (!user.app_metadata) {
			return false
		}
		return user.app_metadata[`${strategy}_customer_id`] 
	}
	async checkoutWith(strategy = this.checkoutStrategy) {
		return this.requireAuth(arguments, async() => {
			const customer_id = await this.createCustomer(strategy);
			const payConfig = {
				// strategies: this.options.strategies,
				email: this.$auth.user.email,
				apiUrl: this.options.apiUrl,
				customer_id: customer_id,
				token: this.token,
				baseUrl: this.options.baseUrl,
				path: this.route.path
			}
			const strat = {
				"stripe": new Stripe(this.ctx, payConfig)
			}
			return Promise.resolve(strat[strategy])
		})
	}
	async useStrategy(strategy) {
		const payConfig = {
			// strategies: this.options.strategies,
			token: this.token,
			apiUrl: this.options.apiUrl,
		}
		const strat = {
			"stripe": new Stripe(this.ctx, payConfig)
		}
		return strat[strategy]
	}
	async activateRoles() {
		return this.requireAuth(arguments, async() => {
			const meta = await this.getSubscriptionMeta();
			console.log("META", meta)
			if (!meta) {
				return Promise.resolve()
			}
			const roles = await this.getUserRoles();
			console.log("roles", roles)
			let promises = [];
			for (let key in meta) {
				if (meta[key].hasOwnProperty(`auth0_role`)) {
					let roleAlreadyAdded = roles.filter(role => meta[key].auth0_role == role.id);
					console.log("key", key)
					console.log("RolesAlreadyAdded", roleAlreadyAdded, meta[key].auth0_role)
					if (roleAlreadyAdded.length == 0) {
						promises.push(this.updateUserRoles(key))
					}
				}
			}
			let resolvedRoles = await Promise.all(promises)
			let newRoles = this.storage.getFromStorage("authRoles") ? this.storage.getFromStorage("authRoles") : [];
			if (promises.length > 0) {
				resolvedRoles.forEach(r => {
					newRoles.push(...r)
				})
			}
			this.storage.addToStorage("authRoles", newRoles)
			return Promise.resolve()
		})
	}
	async createCustomer(strategy = this.checkoutStrategy) {
		let cachedCustomer = await this.customer_id(strategy);
		if (cachedCustomer) {
			return Promise.resolve(cachedCustomer)
		}
		try {
			this.store.commit("boss/loadingStatus", { status: true, message: "Creating Customer"});
			let checkout = await this.useStrategy(strategy)
			let customer_id = await checkout.createCustomer();
			this.store.commit("boss/loadingStatus", { status: true, message: "Associating customer"});
			let user = await this.auth.updateAppMeta({[`${strategy}_customer_id`] : customer_id})
			this.storage.addToStorage("authUser", user)
			this.store.commit("boss/loadingStatus", false);
			return Promise.resolve(customer_id);
		} catch(err) {
			Promise.reject(err)
		}
	}
	// async saveSubscriptions(subscription_id) {
	// 	// prod_JqJvNAooiwkE6f
	// 	subscription_id.plan.product
	// 	this.storage.addToStorage("subscriptions", subscription_id)
	// }
	async createSubscription(strategy = "stripe", cardToken, subscriptionData) {
		let customer_id = await this.createCustomer(strategy);
		try {
			this.store.commit("boss/loadingStatus", { status: true, message: "Creating Subscription"});
			let newCheckout = await this.checkoutWith(strategy)
			let createdCard = await newCheckout.addCard(cardToken);
			if (this.debug) {
				console.log("CardToken", createdCard)
			}
			let createdSubscription = await newCheckout.createSubscription(subscriptionData)
			this.store.commit("boss/loadingStatus", false);
			return Promise.resolve(createdSubscription);
		} catch(err) {
			Promise.reject(err)
		}
	}
	async fetchSubscriptions(strategy = "stripe") {
		return this.requireAuth(arguments, async(strategy) => {
			try {
				if (this.debug) {
					console.log("...Fetching Subscriptions")
				}
				this.store.commit("boss/loadingStatus", { status: true, message: "Fetching Subscriptions"});
				let newCheckout = await this.checkoutWith(strategy)
				let subscriptions = await newCheckout.subscriptionsList()
				if (this.debug) {
					console.log("...Fetched Subscriptions", subscriptions)
				}
				this.storage.addToStorage(`stripe_subscriptions`, subscriptions)
				this._subscriptionsFetchedOnce = true;
				return Promise.resolve(subscriptions);
			} catch(err) {
				Promise.reject(err)
			} finally {
				this.store.commit("boss/loadingStatus", false);
			}
		})
	}
	async fetchPlans(strategy = "stripe") {
		try {
			this.store.commit("boss/loadingStatus", { status: true, message: "Fetching Plans"});
			let newCheckout = await this.useStrategy(strategy)
			let plans = await newCheckout.pricesList({ type: "recurring" })
			// this.storage.addToStorage("plans", subscriptions)
			// this._subscriptionsFetchedOnce = true;
			this.store.commit("boss/loadingStatus", false);
			return Promise.resolve(plans);
		} catch(err) {
			Promise.reject(err)
		}
	}
	async getSubscriptions(strategy = "stripe") {
		return this.requireAuth(arguments, async(strategy) => {
			if (!this.subscriptionsFetchedOnce) {
				return this.fetchSubscriptions(strategy)
			} else {
				let local = this.storage.getFromStorage(`stripe_subscriptions`)
				if (this.debug) {
					console.log("RETURNING LOCAL SUBSCRIPTIONS", local)
				}
				return Promise.resolve(local)
			}
		})
	}
	async getSubscriptionMeta(strategy = "stripe") {
		return this.requireAuth(arguments, async(strategy) => {
			let ss = await this.checkoutWith(strategy)
			let subscriptions = await this.getSubscriptions()
			let totalMeta = {};
			subscriptions ? subscriptions.forEach(sub => {
				console.log("SSSSS SUB", sub)
				let subMeta = ss.getSubscriptionMeta(sub);
				if (subMeta) {
					totalMeta[sub.price] = subMeta
				}
			}) : null;
			return Promise.resolve(totalMeta)
		})
	}
	async fetchProducts(strategy = "stripe", params) {
		try {
			let st = await this.useStrategy(strategy);
			return Promise.resolve(st.productsList(params))
		} catch(err) {
			Promise.reject(err)
		}
	}
	async fetchProduct(strategy = "stripe", product_id) {
		try {
			let st = await this.useStrategy(strategy);
			return st.productsRetrieve(product_id)
		} catch(err) {
			Promise.reject(err)
		}
	}
	async requireAuth(args, cb) {
		if (!args || !cb) throw "Two Arguments required for requireAuth";
		if (!this.$auth.loggedIn) {
			console.log("Not logged in")
			let message = "You need to login to do that"
			this.store.commit("boss/loadingStatus", { status: true, message: message});
			return Promise.reject(message)
		}
		return args ? cb(...args) : cb()
	}

	get auth() {
		const authConfig = {
			...this.options,
			token: this.token
		}
		if (this.debug) {
			// console.log("authConfig", authConfig)
		}
		const strat = {
			"auth0": new Auth0({...authConfig, prefix: "auth0"})
		}
		return strat[this.authStrategy]
	}
	// async updateUserRoles(data) {
	// 	// Send update request
	// 	let roles = await this.auth.updateUser(data)
	// 	this.storage.addToStorage("authRoles", roles)
	// 	return this.getUserRoles()
	// }
	async fetchUserRoles() {
		return this.requireAuth(arguments, async() => {
			let roles = await this.auth.fetchUserRoles()
			console.log("Fetched Roles", roles)
			this._rolesFetchedOnce = true;
			this.storage.addToStorage("authRoles", roles)
			return this.getUserRoles()
		})
	}
	async getUserRoles() {
		return this.requireAuth(arguments, async() => {
			let local = this.storage.getFromStorage("authRoles")
			if (!this.rolesFetchedOnce) {
				return this.fetchUserRoles();
				// return this.getUserMeta();
			}
			return Promise.resolve(local)
		})
	}
	async updateUserRoles(price_id) {
		return this.requireAuth(arguments, async(subscription_id) => {
			const customer = await this.createCustomer();
			const rolesAdded = await utils.Lambda.lambdaPost(`${this.options.apiUrl}boss_activate_role`, this.token, {
					price: price_id,
					customer: customer
			})
			return Promise.resolve(this.storage.addToStorage("auth0_roles", rolesAdded))
		})
	}
	async fetchUserMeta() {
		return this.requireAuth(arguments, async() => {
			let authUser = await this.auth.fetchUser()
			console.log("Fetched User", authUser)
			this._userFetchedOnce = true;
			this.storage.addToStorage("authUser", authUser)
			return this.getUserMeta()
		})
	}
	async getUserMeta() {
		return this.requireAuth(arguments, async() => {
			if (!this.userFetchedOnce) {
				return this.fetchUserMeta();
				// return this.getUserMeta();
			}
			let local = this.storage.getFromStorage("authUser")
			// Dangerous recursive fn because userMeta might be undefined
			// if (!local) {
			// 	return this.fetchUserMeta()
			// }
			return Promise.resolve(local)
		})
	}
	async updateUserMeta(data) {
		// Send update request
		let authUser = await this.auth.updateUser(data)
		this.storage.addToStorage("authUser", authUser)
		return this.getUserMeta()
	}
	async init() {
		if (!this.$auth) {
			throw new Error("$auth is not defined");
		}
		try {
			if (this.debug) {
				console.log("Start Mounted")
			}
			await this.mounted()
			if (this.debug) {
				console.log("End Mounted")
			}
		} catch(err) {
			console.log("Init Error", err)
		} finally {
			if (this.debug) {
				console.log("Redirect from state")
			}
			this._redirectFromState(this.ctx.route);
				// redirect on login
				// console.log("Redirecting...", this.ctx.app.router)
				// this.redirect("/landing");
				// Check if redirected
				// this.ctx.app.router.push("login")
		}
	}
	status({status, message}) {
		this.store.commit("boss/loadingStatus", { status: status, message: message });
	}
	// Redirect and update the loading indicator
	async redirect(path) {
		if (process.client) {
			try {
				this.store.commit("boss/loadingStatus", { status: true, message: "Redirect to " + path });
				if (this.debug) {
					await delay(200)
				}
				window.$nuxt.$router.push(path) 
			} catch(err) {
				console.log("redirect Err", err)
			} finally {
				this.store.commit("boss/loadingStatus", false);
			}
		}
	}
	async mounted() {
		try {
			await this.$auth.fetchUser();
		} catch(err) {
			console.log("Unable to fetch user", err)
			await this.login(this.route.path)
		}
		try {

			if (this.$auth.loggedIn) {
				console.log("getting subs", await this.getSubscriptions());
				await this.getUserRoles();
				await this.activateRoles();
			}
			if (this.debug) {
				await delay(200)
			}
			// this.$auth.$storage.watchState('cart_basket', newValue => { console.log("new value", newValue)})
		} catch(err) {
			console.log("Mounted Err", err)
			this.redirect("/login?redirect_url=/")
		} finally {
			this.store.commit("boss/loadingStatus", false);
		}
		return Promise.resolve()
	}
	hasRole(role_id) {
		return this.requireAuth(arguments, async () => {
			let roles = await this.getUserRoles();
			if (!roles) return Promise.resolve(false)
			if (roles) {
				for (let i = 0; i < roles.length; i++) {
					if (roles[i].id === role_id) {
						return Promise.resolve(true);
					}
				}
			} return Promise.resolve(false)
		})
	}
  async logout() {
    if (this.$auth.loggedIn) {
			this.store.commit("boss/loadingStatus", true);
      await this.$auth.logout()
			this.store.commit("boss/loadingStatus", false);
    }
  }
	_redirectFromState(route) {
		const stateUrl = utils.decodeState(route);
		if (!stateUrl) return;
		if (this.debug) {
			console.log("redirectFromState", stateUrl, route)
		}
		this.redirect(stateUrl)
		// this.ctx.app.router.push(stateUrl);
		return stateUrl
  }
	_authenticate(args, redirectUrl) {
    if (!this.$auth.loggedIn) {
			// Redirect to the referring page
			if (typeof redirectUrl === "boolean") {
				redirectUrl = this.route.path;
			}
			if (redirectUrl) {
				args.state = utils.encodeState(redirectUrl);
			}
      return this.$auth.loginWith("auth0", args)
    }
		return Promise.resolve()
  }
  async login(redirectUrl) {
    const args = { params: { screen_hint: "login" }};
    this._authenticate(args, redirectUrl)
  }
  signup(redirectUrl) {
    const args = { params: { screen_hint: "signup" }};
    this._authenticate(args, redirectUrl)
  }    
	// elasticMail(options) {
	// 	if (!elasticMail) {
	// 		throw "ElasticMail not configured"
	// 		return
	// 	}
	// 	let { apiBaseUrl, publicAccountID } = elasticMail;
	// 	let newsletter = new api.ElasticMail({ apiBaseUrl, publicAccountID })
	// 	return newsletter.init()
	// }
}

export default async function (context, inject) {
	const options = JSON.parse(`<%= JSON.stringify(options) %>`)
  const $boss = new Boss(context, options);
	// $boss.checkout = new Purchase(context, options);

  inject('boss', $boss)
  context.$boss = $boss;

	if (process.client) {
		window.onNuxtReady(() => { 
			$boss.init();
		})
	}

  return 
}
