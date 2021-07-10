import Vue from 'vue'
import generalComponents from './lib'
import stripeComponents from './Stripe'
// import components from './lib'
// get options passed from module.js
const options = JSON.parse(`<%= JSON.stringify(options) %>`)
// loop through components and register them
// for (const )

initComponents(generalComponents);
initComponents(stripeComponents);
function initComponents(components) {
  for (const name in components) {
    console.log("Component Name", name)
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