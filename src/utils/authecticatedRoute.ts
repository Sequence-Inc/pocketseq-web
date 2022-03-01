import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export type Roles = "undefined" | "user" | "host" | "admin";

export type AuthenticatedRouteOptions = {
    session: Session;
    pathAfterFailure: string;
    roles?: Roles[];
};

const requireAuth = (options: AuthenticatedRouteOptions) => {
    if (!options.session) {
        return {
            redirect: {
                permanent: false,
                destination: options.pathAfterFailure || "/auth/login",
            },
        };
    }
    if (
        options.roles &&
        !validateRole(options.session.user.roles, options.roles)
    ) {
        return {
            redirect: {
                permanent: false,
                destination: options.pathAfterFailure || "/auth/login",
            },
        };
    }
    return true;
};

export default requireAuth;

function validateRole(sessionRoles, requiredRoles) {
    const filteredArray = sessionRoles.filter((value) =>
        requiredRoles.includes(value)
    );
    return filteredArray.length === 0 ? false : true;
}
