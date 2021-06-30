import React from 'react';

interface ButtonProps {
    variant?: 'primary' | 'secondary';
    type?: 'button' | 'submit';
    children: React.ReactNode;
}

const Button = (props: ButtonProps) => {
    const { variant, type, children } = props;
    return (
        <button
            type={type}
            className={`${variant === 'primary'
                ? 'text-white bg-primary hover:bg-primaryHover focus:ring-primary'
                : variant === 'secondary'
                    ? 'text-gray-400 bg-gray-100 hover:bg-gray-200 focus:ring-primary' : ''} min-w-xxs px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm focus: outline-none focus:ring-2 focus:ring-offset-2
                `}
        >
            {children}
        </button>
    )
}

Button.defaultProps = {
    variant: "primary",
    type: "button",
    children: "Submit"
}

export default Button
