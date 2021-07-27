export default function({$auth, $boss}) {
  if (process.server) return;
  console.log("Auth Client Loaded")
  // $auth.onError((error, name, endpoint) => {
  //   console.error(name, error)
  // })
  $boss.mounted($auth)
}