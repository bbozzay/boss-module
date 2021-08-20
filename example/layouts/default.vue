<template>
  <div>
    <boss-loading />
    <header id="mainHeader">
      <client-only>
        <div v-if="$auth.loggedIn" style="color: green">
          Logged in as {{ $auth.user.email }}
        </div>
        <button v-show="!$auth.loggedIn" @click="$boss.login($route.path)">
          Login
        </button>
        <button v-show="!$auth.loggedIn" @click="$boss.signup($route.path)">
          Signup
        </button>
        <button v-show="$auth.loggedIn" @click="$boss.logout()">
          Logout
        </button>
      </client-only>
    </header>
    <nav>
      <ul>
        <li v-for="route in routes" :key="route.id">
          <nuxt-link :to="route.path">
            {{ route.name }}
          </nuxt-link>
          <ul v-if="route.sub">
            <li v-for="sub_route in route.sub" :key="sub_route.id">
              <nuxt-link :to="sub_route.path">
                {{ sub_route.name }}
              </nuxt-link>
            </li>
          </ul>
        </li>
      </ul>
      <boss-cart />
    </nav>
    <main>
      <Nuxt />
    </main>
  </div>
</template>

<script>
export default {
  data () {
    return {
      routes: [
        {
          name: 'Home',
          path: '/'
        },
        {
          name: 'Products',
          path: '/products'
        },
        {
          name: 'Plans',
          path: '/plans'
        },
        {
          name: 'Checkout',
          path: '/checkout'
        },
        {
          name: 'Landing',
          path: '/landing'
        },
        {
          name: 'Account',
          path: '/account',
          sub: [{
            name: 'Billing',
            path: '/account/billing'
          }]
        },
        {
          name: 'Require Login',
          path: '/require-login'
        },
        {
          name: 'Require Plan',
          path: '/require-plan'
        },
        {
          name: 'Require Role',
          path: '/require-role'
        }
      ]
    }
  }
}
</script>
