import { destroyCookie, parseCookies, setCookie } from "nookies";

export const storeSession = (session): void => {
    const data = encodeURIComponent(JSON.stringify(session));
    console.log(data);
    debugger;
    setCookie(null, "session", data, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        encode: (data) => {
            return data;
        },
    });
};

export const removeSession = (cookieName: string): void => {
    destroyCookie(null, cookieName);
};

export const logout = (): void => {
    removeSession("session");
    window.location.href = "/";
};

export const getSession = () => {
    const cookies = parseCookies(null, {
        decode: (data) => {
            return JSON.parse(decodeURIComponent(data));
        },
    });
    console.log("decoded Data", cookies);
    return cookies.session ? cookies.session : null;
};

export const isAuthenticated = (): boolean => {
    return !!getSession();
};

export const authorizeRole = (requiredRole): boolean => {
    // check if authenticated
    if (!isAuthenticated()) return false;

    const currentSession = getSession();
    if (!currentSession.roles) return false;

    const userRole = currentSession.roles;

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
