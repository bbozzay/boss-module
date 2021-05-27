export default function({$auth, $boss}) {
  return new Promise(async(resolve, reject) => {
    if (process.server || !$auth.loggedIn) return resolve();
    // Mounted Only
    if ($auth.loggedIn) {
      console.log("Populate store...")
      return resolve(await $boss.fetchMeta());
    }
  })
}