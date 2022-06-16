import { Footer, Header } from "@layout";
import { Session } from "next-auth";
import React from "react";

const AuthLayout = ({
    userSession,
    children,
}: {
    userSession: Session;
    children: React.ReactNode;
}) => {
    return (
        <div>
            <Header userSession={userSession} />
            <div className="py-20 align-middle bg-gray-100">
                <div>{children}</div>
            </div>
            <Footer />
        </div>
    );
};

export default AuthLayout;
