import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
    variant?: "primary" | "secondary";
    type?: "button" | "submit";
    className?: string;
    children: React.ReactNode;
}

const Button = (props: ButtonProps) => {
    const { variant, type, className, children } = props;
    return (
        <button
            type={type}
            className={clsx(
                'min-w-xxs px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm',
                'focus:outline-none focus:ring-2 focus:ring-offset-2', {
                'text-white bg-primary hover:bg-primaryHover focus:ring-primary': variant === 'primary',
                'text-gray-400 bg-gray-100 hover:bg-gray-200 focus:ring-primary': variant === 'secondary'
            }
            )}
        // className={`${
        //     variant === "primary"
        //         ? "text-white bg-primary hover:bg-primaryHover focus:ring-primary"
        //         : "text-gray-400 bg-gray-100 hover:bg-gray-200 focus:ring-gray-200"
        // } w-full flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded shadow-sm focus: outline-none focus:ring-2 focus:ring-offset-2 ${
        //     className && className
        // } `}
        >
            {children}
        </button>
    );
};

Button.defaultProps = {
    variant: "secondary",
    type: "button",
    className: "",
    children: "Submit",
};

export default Button;
