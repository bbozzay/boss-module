// const options = JSON.parse(`<%= JSON.stringify(options) %>`)
const options = false
// extract the namespace var

const bossStore = options => ({
  namespaced: true,
  state: () => ({
    loading: {
      status: true,
      message: null
    }
  }),
  mutations: {
    loadingStatus(state, payload) {
      console.log("mutation", payload)
      let message = payload.hasOwnProperty("message") ? payload.message : null;
      let status = payload.hasOwnProperty("status") ? payload.status : false;
      if (typeof payload === "boolean") {
        status = payload;
      }
      state.loading.status = status;
      state.loading.message = message;
    }
  },
  getters: {
    // count: state => state.count
    loadingStatus: state => state.loading
  }
})

export default async(context, inject) => {
  // register the module using namespace as the name.
  // counter module takes the options object and returns an object that is a
  // vuex store defenition
  const { store } = context;
  store.registerModule("boss", bossStore(options), {
    preserveState: Boolean(store.state.boss) // if the store module already exists, preserve it
  })
}