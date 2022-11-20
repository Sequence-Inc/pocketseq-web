import React from "react";
import clsx from "clsx";
import { config } from "src/utils";

interface LogoProps {
    variant?: "default" | "dark";
    size?: "default" | "large";
    className?: string;
}

const Logo = ({ variant, size, className }: LogoProps) => {
    const style = size === "default" ? "h-10" : "h-14";
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
            <img
                src={
                    variant === "default"
                        ? "/logo_primary.svg"
                        : "/logo_secondary.svg"
                }
                alt="PocketseQ"
                className={style}
            />
        </div>
    );
};

Logo.defaultProps = {
    variant: "default",
    size: "default",
};

export default Logo;
