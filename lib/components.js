import Vue from 'vue'
import checkout from './components/checkout'
import blog from './components/blog'
// import components from './lib'
// get options passed from module.js
const options = JSON.parse('<%= JSON.stringify(options) %>')
// loop through components and register them
// for (const )

initComponents(checkout)
initComponents(blog)

function initComponents (components) {
  for (const name in components) {
    Vue.component(name, {
      // extend the original component
      extends: components[name],
      // add a _customCounterOptions prop to gain access to the options in the component
      props: {
        _customCounterOptions: {
          type: Object,
          default: () => ({ ...options })
        }
      }
    })
  }
}
