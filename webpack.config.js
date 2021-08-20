const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    './module': './lib/module.js',
    plugin: './lib/plugin.js'
    // './lib/store.js': './store.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  }
}
