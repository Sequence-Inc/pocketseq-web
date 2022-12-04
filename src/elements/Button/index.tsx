import React from "react";
import clsx from "clsx";

import { Spin } from "antd";

interface ButtonProps {
    variant?: "primary" | "secondary" | "white" | "disabled";
    rounded?: boolean;
    type?: "button" | "submit";
    className?: string;
    children: React.ReactNode;
    loadingText?: string;
    loading?: boolean;
    disabled?: boolean;
    Icon?: React.ComponentType<{ className: string }>;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    style?: any;
}

const Button = (props: ButtonProps) => {
    const {
        rounded,
        variant,
        type,
        className,
        loadingText,
        disabled,
        loading,
        children,
        Icon,
        ...rest
    } = props;
    return (
        <button
            type={type}
            disabled={loading || disabled}
            className={clsx(
                "w-full flex items-center justify-center text-sm font-medium",
                "border border-transparent shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                {
                    "opacity-50": disabled || loading,
                    "text-white bg-primary hover:bg-primaryHover focus:ring-primary":
                        variant === "primary",
                    "text-gray-600 bg-gray-100 hover:bg-gray-200 focus:ring-gray-200":
                        variant === "secondary",
                    "text-gray-700 bg-white hover:bg-gray-100 focus:ring-gray-300":
                        variant === "white",
                    "text-gray-600 bg-gray-100 hover:bg-gray-100 focus:ring-gray-100 cursor-default":
                        variant === "disabled",
                    "rounded p-2": !rounded,
                    "rounded-full px-4 py-2": rounded,
                },
                className && className
            )}
            {...rest}
        >
            {loading ? (
                <div className="flex p-0 justify-center">
                    <div className="animate-spin h-5 w-5 border-3 border-b-0 border-r-0 rounded-full" />
                </div>
            ) : !!Icon ? (
                <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-2 text-inherit" />
                    <span>{children}</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

Button.defaultProps = {
    variant: "secondary",
    type: "button",
    className: "",
    rounded: false,
    children: "Submit",
    disabled: false,
    onClick: (event) => {},
};

export default Button;
