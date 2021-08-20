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

export const parent_link = {
  data() {
    return {
      parentLink: getParentLink(this.$route.path, this.$route.params.slug),
    }
  },
  computed: {
    parentName() {
      // Replace first slash with no space
      // Replace every other slash with a space
      let parentsNames = this.parentLink.split('/');
      let parentName = parentsNames[parentsNames.length-1];
      console.log(parentName)
      return parentName.replace(/\-/g, " ");
    }
  }
}
