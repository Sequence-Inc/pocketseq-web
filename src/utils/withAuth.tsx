import { useRouter } from "next/router";
import React from "react";
import { isLoggedIn, currentSession } from "src/apollo/cache";

const withAuth = (WrapperComponent) => {
    return (props) => {
        if (typeof window !== "undefined") {
            const router = useRouter();

            if (!isLoggedIn() || !currentSession()) {
                router.replace("/");
                return null;
            }
            return (
                <WrapperComponent
                    {...props}
                    currentSession={currentSession()}
                />
            );
        }

        return null;
    };
};

export default withAuth;
