export default (context, inject) => {
  if (process.server) return;
  console.log("extend boss")

  class ExtendBoss {
    constructor(context) {
      this.$auth = context.$auth
      this.$boss = context.$boss
    }

    async mounted() {
      if (this.$auth.loggedIn) {
        // this.$boss.status({ status: true, message: "Fetching Subscriptions"} )
        try {
          // let meta = await this.$boss.getSubscriptionMeta("stripe")
          // console.log("Subscriptions Meta", meta)
          // const rr = await this.$boss.activateRoles("stripe")
          // console.log("RR", rr)
        } catch(err) {
          // console.log("Boss Extend Mounted Error", err)
          // this.$boss.status({ status: false })
        }
      }

    }
    // async checkRoles(subscriptions) {
    //   return this.$boss.requireAuth(arguments, async(subscriptions) => {
    //     this.$boss.status({ status: true, message: "Checking Roles"} )
    //     // console.log("Check Roles", subscriptions)
    //     let roles = await this.$boss.getUserRoles()
    //     // console.log("Check Roles =", roles)
    //     this.$boss.status({ status: false } )
    //   })
    // }

    assignRole() {

    }

    removeRole() {

    }

  }

  const extendedBoss = new ExtendBoss(context);
  extendedBoss.mounted();
}