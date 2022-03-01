import NextAuth from "next-auth";
import { type } from "os";

import Roles from "../src/apollo/queries/auth.queries";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            name: string;
            nameKana: string;
            email: string;
            roles: Roles[];
        } & DefaultSession["user"];
    }
}
