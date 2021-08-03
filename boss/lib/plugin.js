// import "./vendors";
import base64url from 'base64url';
import delay from 'delay';

const debug = process.env.DEBUG ? true : false;

const encodeState = (path) => {
  let encodedUrl = base64url(path);
  return encodedUrl;
}
const decodeState = (route) => {
  if (!route.hash) return false;
  let splitUrl = route.hash.split("&"), 
      stateEntry = splitUrl.filter(part => part.indexOf("state") > -1);
  if (!stateEntry.length > 0) return false
  let stateValue = stateEntry[0].substring(stateEntry[0].indexOf("=")+1)
  if (!stateValue) return false
  let parsedUrl = base64url.decode(stateValue)
  return parsedUrl
}
const redirectFromState = async() => {
    return new Promise((resolve, reject) => {
      try {
        const stateUrl = decodeState(this.route);
        if (!stateUrl) return resolve();
        if (devMode) {
          console.log("REDIRECT", stateUrl)
        }
        this.app.router.push(stateUrl);
        return resolve(stateUrl);
      } catch(err) {
        console.log("redirectFromState", err)
        return reject(JSON.stringify(err.message))
      }
    })
  }

class Auth {
	constructor(context) {
		this.ctx = context;	
	}
}

class Boss {
	constructor(context, options) {
		this.$auth = context.$auth;
		this.ctx = context;
		this.store = context.store;
		this.options = options;
	}
	async init() {
		console.log("BOSS LOADED WITH AUTH", this.$auth)
		if (!this.$auth) {
			throw new Error("$auth is not defined");
		}
		try {
			console.log("State Mounted")
			await this.mounted()
			console.log("End Mounted")
		} catch(err) {
			console.log("call on err", err)
		} finally {
			this._redirectFromState(this.ctx.route);
				// redirect on login
				// console.log("Redirecting...", this.ctx.app.router)
				// this.redirect("/landing");
				// Check if redirected
				// this.ctx.app.router.push("login")
		}
	}
	async redirect(path) {
		if (process.client) {
			try {
				this.store.commit("boss/loadingStatus", { status: true, message: "Redirect to " + path });
				if (debug) {
					await delay(500)
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
			if (debug) {
				await delay(500)
			}
		} catch(err) {
			console.log("Mounted Err", err)
		} finally {
			this.store.commit("boss/loadingStatus", false);
		}
		return Promise.resolve()
	}
  async logout() {
    if (this.$auth.loggedIn) {
			this.store.commit("boss/loadingStatus", true);
      await this.$auth.logout()
			this.store.commit("boss/loadingStatus", false);
    }
  }
	_redirectFromState(route) {
		const stateUrl = decodeState(route);
		if (!stateUrl) return;
		if (debug) {
			// console.log("REDIRECT", stateUrl, this.ctx)
		}
		this.redirect(stateUrl)
		// this.ctx.app.router.push(stateUrl);
		return stateUrl
  }
	_authenticate(args, redirectUrl) {
    if (!this.$auth.loggedIn) {
			if (redirectUrl) {
				args.state = encodeState(redirectUrl);
			}
      return this.$auth.loginWith("auth0", args)
    }
  }
  login(redirectUrl) {
    const args = { params: { screen_hint: "login" }};
    this._authenticate(args, redirectUrl)
  }
  signup(redirectUrl) {
    const args = { params: { screen_hint: "signup" }};
    this._authenticate(args, redirectUrl)
  }
}
export default async function (context, inject) {
	const options = JSON.parse(`<%= JSON.stringify(options) %>`)
  const $boss = new Boss(context, options);
  inject('boss', $boss)
  context.$boss = $boss;


	if (process.client) {
		window.onNuxtReady(() => { 
			$boss.init();
			// $boss._redirectFromState(context.route)
		})
	}
  return 
}
