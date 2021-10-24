import { destroyCookie, parseCookies, setCookie } from "nookies";

export const storeSession = (session): void => {
    setCookie(null, "session", JSON.stringify(session), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
    });
};

export const storeProfile = (profile): void => {
    setCookie(null, "session_profile", JSON.stringify(profile), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
    });
};

export const removeSession = (cookieName: string): void => {
    destroyCookie(null, cookieName);
};

export const logout = (): void => {
    removeSession("session");
    removeSession("session_profile");
    window.location.href = "/";
};

export const getSession = () => {
    const cookies = parseCookies();
    return cookies.session ? JSON.parse(cookies.session) : null;
};

export const getUserRole = () => {
    const cookies = parseCookies();
    const parsedCookies = cookies.session_profile ? JSON.parse(cookies.session_profile) : null;
    return parsedCookies ? parsedCookies.roles : null;
};

export const getInitialSession = () => {
    const cookies = parseCookies();
    return cookies.session ? JSON.parse(cookies.session) : null;
};

export const getInitialProfile = () => {
    const cookies = parseCookies();
    return cookies.session_profile ? JSON.parse(cookies.session_profile) : null;
};

export const isAuthenticated = (): boolean => {
    return !!getSession();
};

export const authorizeRole = (requiredRole: string[]): boolean => {
    // check if authenticated
    if (!isAuthenticated()) return false;

    const userRole = getUserRole();
    if (!userRole) return false;

    const sorted_requiredRole = requiredRole.concat().sort();
    const sorted_userRole = userRole.concat().sort();
    const common = [];
    let requiredRole_i = 0;
    let userRole_i = 0;

    while (
        requiredRole_i < requiredRole.length &&
        userRole_i < userRole.length
    ) {
        if (
            sorted_requiredRole[requiredRole_i] === sorted_userRole[userRole_i]
        ) {
            common.push(sorted_requiredRole[requiredRole_i]);
            requiredRole_i++;
            userRole_i++;
        } else if (
            sorted_requiredRole[requiredRole_i] < sorted_userRole[userRole_i]
        ) {
            requiredRole_i++;
        } else {
            userRole_i++;
        }
    }
    return common.length > 0 ? true : false;
};
