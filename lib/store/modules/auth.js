// store/modules/counter.js
export default options => ({
  namespaced: true,
  state: () => ({
    options,
    redirectUrl: "/login"
  }),
  mutations: {
    redirectUrl(state, url) {
      state.redirectUrl = url
    }
  },
  getters: {
    // count: state => state.count
  }
})