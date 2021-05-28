const getParentLink = (currentLink, currentSlug) => {
  // parse a url and get the next parent
  // let splitUrl = currentLink.split("/")
  // splitUrl = splitUrl.filter(item => item !== "");
  return currentLink.replace("/" + currentSlug, "")
}
// for a course at /learn/build-fast-websites/overview, get /learn/build-fast-websites
// const parentPath = (data, hardCodedPath) => {
//   return foundParentLink ? foundParentLink : hardCodedPath
// }
const getParentSlug = (currentLink, currentSlug) => {
  // parse a url and get the next parent
  let splitUrl = currentLink.split("/")
  return splitUrl.length > 2 ? splitUrl[splitUrl.length-2] : splitUrl[splitUrl.length-1];
}

module.exports = {
  getParentLink,
  getParentSlug
}