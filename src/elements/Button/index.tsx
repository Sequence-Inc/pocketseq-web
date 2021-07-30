import React from "react";
import clsx from "clsx";

interface ButtonProps {
    variant?: "primary" | "secondary" | "white";
    rounded?: boolean;
    type?: "button" | "submit";
    className?: string;
    children: React.ReactNode;
    loadingText?: string;
    loading?: boolean;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
                    "text-gray-400 bg-gray-100 hover:bg-gray-200 focus:ring-gray-200":
                        variant === "secondary",
                    "text-gray-500 bg-white hover:bg-gray-100 focus:ring-gray-100":
                        variant === "white",
                    "rounded p-2": !rounded,
                    "rounded-full px-4 py-2": rounded
                },
                className && className
            )}
            {...rest}
        >
            {loading ? 'loading...' : children}
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
    onClick: (event) => { },
};

export default Button;
