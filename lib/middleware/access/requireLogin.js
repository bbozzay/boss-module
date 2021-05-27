// Client-side middleware
export default ({options, $auth, redirect, route}) => {
    if (!$auth.loggedIn) {
        return redirect(`${options.paths.login}/?redirectUrl=${route.path}`)
    }
    return
}