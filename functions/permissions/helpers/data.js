const data = require("../../../data/plans.json");
const getSelectedPlan = (index) => {
  return data.plans[index]
}

module.exports = {
  getSelectedPlan
}