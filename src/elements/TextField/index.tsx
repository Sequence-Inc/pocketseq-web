import React from 'react';

interface TextFieldProps {
    label: string;
    placeholder?: string;
    id?: string;
    className?: string;
    error?: boolean;
    errorMessage?: string;
    rest?: any;
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
                    className={`appearance-none block w-full px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm  ${error
                        ? 'border-error focus:ring-error focus:border-error'
                        : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }`}
                    {...rest}
                />

                {error && (
                    <span className="text-sm text-error">{errorMessage}</span>
                )}
            </div>
        </div>
    );
};

export default TextField;
