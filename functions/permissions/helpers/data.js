const data = require("../../../data/plans.json");
const getSelectedPlan = (index) => {
  return data.plans[index]
}
const getSelectedSubscription = (index) => {
  return data.subscriptions[index]
}

module.exports = {
  getSelectedPlan,
  getSelectedSubscription
}