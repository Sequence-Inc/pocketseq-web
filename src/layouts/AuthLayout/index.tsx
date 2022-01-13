import { Footer, Header } from "@layout";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Header />
            <div className="py-20 align-middle bg-gray-100">
                <div>{children}</div>
            </div>
            <Footer />
        </div>
    );
};

export default AuthLayout;
