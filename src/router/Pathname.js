export const PATH_NAME = {
    SIGNUP: "/signup",
    SIGNIN: "/signin",
    STARTPAGE: "/",
    DASHBOARD: "/dashboard",
    NOTE_GALLERY: "/noteGallery",
    SMART_LEARNING: "/smartLearning",
    INFORMATION: "/information",
    TRASH: "/trash",
    SUBSCRIPTION_NOW: "/subcription",
    CHECKOUT: "/checkout",
    HELP_CENTER: "/helpCenter",
    NOTE_CANVAS: "/notecanvas/:id",
    ADMIN_DASHBOARD: "/adminDashboard",
    ADMIN_USERMANGEMENT: "/adminUserManagement",
    ADMIN_SUBSCRIPTION: "/adminSubcription",
};

/**
 * Utility function to retrieve a route path by name.
 * @param {string} routeKey - The key representing the route.
 * @returns {string|null} - The route path if found, otherwise null.
 */
export const Pathname = (routeKey) => {
    if (PATH_NAME.hasOwnProperty(routeKey)) {
        return PATH_NAME[routeKey];
    }
    console.warn(`Pathname: Route key "${routeKey}" does not exist.`);
    return null; // Fallback for invalid keys
};