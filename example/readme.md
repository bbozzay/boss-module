## Setup

### Nuxt.config

1. Add Required Modules:
```
...
modules: [
	"@nuxtjs/axios",
	"@nuxtjs/auth-next"
 "nuxt-boss"
]
```

Axios and auth-next should be loaded before nuxt-boss.

2. Set Boss config:
```
...
boss: {
	debug: true,
	baseUrl: process.env.BASEURL,
	apiBaseUrl: 'http://localhost:8888',
	strategies: {
		stripe: {
			publishableKey: process.env.STRIPE_PUB_KEY
		}
	},
	roles: {
		default: "rol_EbiRY15A381WvjLJ"
	},
	plugins: [{ src: resolve(__dirname, './plugins/extend_boss.client.js')}],
},
...
```

3. Set $auth config (nuxt-auth):
```
...
auth: {
	cookie: {
		maxAge: 36000
	},
	redirect: {
		login: '/login',
		logout: '/logout',
		callback: '/login',
		// home: '/'
		home: false
	},
	strategies: {
		local: false,
		auth0: {
			domain: process.env.AUTH0_DOMAIN,
			clientId: process.env.AUTH0_CLIENT_ID,
			audience: process.env.AUTH0_AUDIENCE,
			scope: ['openid', 'profile', 'email'],
			redirectUri: process.env.BASEURL + '/login',
			logoutRedirectUri: process.env.BASEURL + '/logout'
		}
	}
}