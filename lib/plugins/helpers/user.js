export const getAppMeta = ({ state, namespace }) => {
  try {
    return state[`${namespace}`].user.appMetaData;
  } catch(err) {
    console.log("helpers/getAppMeta", err)
  }
}
export const getUserMeta = ({ state, namespace }) => {
  try {
    return state[`${namespace}`].user.userMetaData;
  } catch(err) {
    console.log("helpers/getUserMeta", err)
  }
}
export const setUserMeta = ({ store, namespace }, meta) => {
  try {
    store.commit(`${namespace}/user/userMetaData`, meta)
    return meta
  } catch(err) {
    console.log("helpers/setUserMeta", err)
  }
}
// export const setSignupMeta = ({ baseUrl, namespace, store, state, $auth}, meta) => {
//   // console.log("helpers/user/setSignupMeta", meta)
//   if (!state[`${namespace}`].user.userMeta) {
//     // const referrerUrl = state[`${namespace}`].redirectUrl
//     try {
//       addUserMeta({baseUrl, namespace, $auth}, meta)
//     } catch(err) {
//       console.log("setSignupMeta", err.message)
//     }
//   }
// }