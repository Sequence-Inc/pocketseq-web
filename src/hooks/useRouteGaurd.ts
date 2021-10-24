import { useRouter } from "next/router";

type Allowed = boolean | "no render";

const useRouteGaurd = () => {
    const router = useRouter();
    const module = router.pathname.startsWith("/host") ? "host" : router.pathname.startsWith("/admin") ? "admin" : "user";
    const user: boolean = true;
    const role: string = "admin";
    let allowed: Allowed = true;
    if (router.pathname.startsWith("/host") && role !== "host") {
        allowed = false;
    }
    if (router.pathname.startsWith("/admin") && role !== "admin") {
        allowed = false;
    }

    if (role === module) return;

    if (role === "user") {
        router.replace("/");
    }
    if (role === "host") {
        router.replace("/host");
    }
    if (role === "admin") {
        router.replace("/admin");
    }

    return allowed;
}

export default useRouteGaurd;