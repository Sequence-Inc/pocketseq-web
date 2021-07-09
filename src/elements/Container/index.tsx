import React from "react";

const Container = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={`px-4 mx-auto pace-y-6 max-w-7xl sm:px-6 lg:px-8 ${
                className && className
            }`}
        >
            {children}
        </div>
    );
};

export default Container;
