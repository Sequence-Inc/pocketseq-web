import { useRouter } from "next/router";
import React from "react";
import { isLoggedIn, currentSession } from "src/apollo/cache";
import { getSession, useSession } from "next-auth/react";

const withAuth = (WrappedComponent) => {
    return (props) => {
        if (typeof window !== "undefined") {
            const router = useRouter();
            // if (!session) {
            //     router.replace("/");
            //     return null;
            // }
            return <WrappedComponent {...props} />;
        }
        return null;
    };
};

export async function getInitialProps(context) {
    const session = await getSession(context);
    return {
        props: {
            userSession: session,
        },
    };
}

export default withAuth;
