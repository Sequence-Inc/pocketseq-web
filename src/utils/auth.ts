import { destroyCookie, parseCookies, setCookie } from "nookies";

export const storeSession = (session): void => {
    setCookie(null, 'session', JSON.stringify(session), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
    });
}

export const removeSession = (cookieName: string): void => {
    destroyCookie(null, cookieName)
}

export const logout = (): void => {
    removeSession('session');
    window.location.href = "/";
}

export const getSession = () => {
    const cookies = parseCookies();
    return cookies.session ? JSON.parse(cookies.session) : null;
}

export const isAuthenticated = (): boolean => {
    return !!getSession();
}