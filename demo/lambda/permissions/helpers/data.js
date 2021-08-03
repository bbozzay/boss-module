const products = require("../../../data/products.json");
const getSelectedProduct = (index) => {
  return products[index]
}
// const getSelectedSubscription = (index) => {
//   return data.subscriptions[index]
// }

module.exports = {
  getSelectedProduct
  // getSelectedSubscription
}