// store/modules/access.js
export default options => ({
  namespaced: true,
  state: () => ({
    roles: null
  }),
  mutations: {
    roles(state, payload) {
      state.roles = payload
    },
  },
  getters: {
    // count: state => state.count
  }
})