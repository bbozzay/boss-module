// debug.js
const options = JSON.parse(`<%= JSON.stringify(options) %>`)
const { debug, namespace } = options
if (process.env.NODE_ENV !== "production") {
  console.log(`module debugger --- --- -- - -- - ${namespace}: `, options, process.env.NODE_ENV)
}