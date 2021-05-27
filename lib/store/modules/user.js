// store/modules/counter.js
export default options => ({
  namespaced: true,
  state: () => ({
    options,
    userMetaData: null,
    appMetaData: null
  }),
  mutations: {
    // Fetch meta from auth0 and add to the store
    userMetaData(state, payload) {
      state.userMetaData = payload
    },
    appMetaData(state, payload) {
      state.appMetaData = payload
    },
    signupUserMeta(state, payload) {
      // if (state.userMeta) return;
      state.userMeta = payload;
    }
  },
  getters: {
    // count: state => state.count
    userMetaEntry: state => (key) => {
      return state.userMeta[key]
    }
  }
})