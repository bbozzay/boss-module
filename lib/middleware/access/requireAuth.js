// Client-side middleware
export default async({$boss, route, store}, namespace) => {
    $boss.redirectUrl = route.path;
    $boss.requireLogin();
}