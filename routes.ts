/**
 * Array of routes that are accessable to the public
 * These routes does not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    "/auth/new-verification",
    "/s/new-order-verification",
    "/s/status",
    "/s/checkout",
    "/api/auth/providers",
    "/api/create-payment-intent",
    "/marketplace",
    "/about",
    "/pricing"
];

// "/s/:path" is open link for public path

/**
 * Array of routes that are used for authentication
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/reset",
    "/auth/new-password",
    "/auth/error"
];


/**
 * The prefix for API authentication routes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"


/**
 * The default redirect path
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"