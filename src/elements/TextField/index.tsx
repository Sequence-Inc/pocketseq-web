import React from 'react';
import clsx from "clsx";

interface TextFieldProps {
    label: string;
    placeholder?: string;
    type?: string;
    id?: string;
    className?: string;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    tabIndex?: number;
}

const TextField = (props: TextFieldProps) => {
    const { label, id, className, error, errorMessage, ...rest } = props;

    return (
        <div className={`space-y-1 ${className}`}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative rounded-md ">
                <input
                    id={id}
                    className={clsx(
                        'appearance-none block w-full px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400',
                        'focus:outline-none sm:text-sm', {
                        'border-error focus:ring-error focus:border-error': error,
                        'border-gray-300 focus:ring-primary focus:border-primary': !error
                    }
                    )}
                    {...rest}
                />

                {error && (
                    <span className="text-sm text-error">{errorMessage}</span>
                )}
            </div>
        </div>
    );
};

TextField.defaultProps = {
    label: "",
    placeholder: "",
    type: "text",
    id: "",
    className: "",
    error: false,
    errorMessage: ""
}

export default TextField;
