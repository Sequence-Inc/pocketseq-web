import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
    variant?: "primary" | "secondary" | "white";
    rounded?: boolean;
    type?: "button" | "submit";
    className?: string;
    children: React.ReactNode;
    loadingText?: string;
    loading?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = (props: ButtonProps) => {
    const { rounded, variant, type, className, loadingText, loading, children, ...rest } = props;
    return (
        <button
            type={type}
            className={clsx(
                'w-full flex items-center justify-center text-xs font-medium',
                'border border-transparent shadow-sm',
                'focus:outline-none focus:ring-2 focus:ring-offset-2', {
                'text-white bg-primary hover:bg-primaryHover focus:ring-primary': variant === 'primary',
                'text-gray-400 bg-gray-100 hover:bg-gray-200 focus:ring-gray-200': variant === 'secondary',
                'text-gray-500 bg-white hover:bg-gray-100 focus:ring-gray-100': variant === 'white',
                'rounded p-2': !rounded,
                'rounded-full px-4 py-2': rounded
            },
                className && className
            )}
            {...rest}
        >
            {children}
        </button>
    );
};

Button.defaultProps = {
    variant: "secondary",
    type: "button",
    className: "",
    rounded: false,
    children: "Submit",
    onClick: (event) => { }
};

export default Button;
