import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
    variant?: "primary" | "secondary";
    type?: "button" | "submit";
    className?: string;
    children: React.ReactNode;
    loadingText?: string;
    loading?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = (props: ButtonProps) => {
    const { variant, type, className, loadingText, loading, children, ...rest } = props;
    return (
        <button
            type={type}
            className={clsx(
                'w-full flex items-center justify-center p-2 text-xs font-medium rounded',
                'border border-transparent shadow-sm',
                'focus:outline-none focus:ring-2 focus:ring-offset-2', {
                'text-white bg-primary hover:bg-primaryHover focus:ring-primary': variant === 'primary',
                'text-gray-400 bg-gray-100 hover:bg-gray-200 focus:ring-gray-200': variant === 'secondary'
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
    children: "Submit",
    onClick: (event) => { }
};

export default Button;
