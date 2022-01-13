import React from "react";
import clsx from "clsx";
import { Container } from "@element";

export const PageHeader = ({ children }) => {
    return (
        <div
            className={clsx(
                "bg-gradient-to-b from-primaryHover via-primary to-primary w-full mt-16 py-20"
            )}
        >
            <Container className="">
                <h2 className="text-2xl font-bold text-center text-white sm:text-4xl">
                    {children}
                </h2>
            </Container>
        </div>
    );
};
