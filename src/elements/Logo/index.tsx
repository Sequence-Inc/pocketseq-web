import React from "react";
import clsx from "clsx";
import { config } from "src/utils";

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
                    // "text-white border": variant === "dark",
                    "text-white": variant === "dark",
                }
            )}
        >
            {/* <ClockIcon className="w-8 h-8 " /> */}
            <img
                src="/timebook-logomark.svg"
                alt="time book logo"
                className="w-10 h-10"
            />
            <span className="ml-3 text-lg font-bold h-7">
                {config.appNameEnglish}
            </span>
        </div>
    );
};

Logo.defaultProps = {
    variant: "default",
};

export default Logo;
