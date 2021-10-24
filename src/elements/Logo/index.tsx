import React from "react";
import clsx from "clsx";
import { ClockIcon } from "@heroicons/react/outline";

interface LogoProps {
    variant?: "default" | "dark";
    className?: string;
}

const Logo = ({ variant, className }: LogoProps) => {
    return (
        <div
            className={clsx(
                "flex justify-center items-center",
                className && className,
                {
                    "text-green-600": variant === "default",
                    "text-white border": variant === "dark",
                }
            )}
        >
            <ClockIcon className="w-8 h-8 " />
            <span className="ml-2 text-lg font-medium h-7">Time Book</span>
        </div>
    );
};

Logo.defaultProps = {
    variant: "default",
};

export default Logo;
