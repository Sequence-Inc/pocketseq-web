import React from 'react';
import clsx from "clsx";
import { ExclamationCircleIcon } from '@heroicons/react/solid';

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
    onBlur?: any;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
    const { label, id, className, error, errorMessage, ...rest } = props;

    return (
        <div className={`space-y-1 ${className}`}>
            {console.log(<input {...rest} />)}
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative rounded-md ">
                <input
                    id={id}
                    ref={ref}
                    className={clsx(
                        'appearance-none block w-full px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400',
                        'focus:outline-none sm:text-sm', {
                        'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500': error,
                        'border-gray-300 focus:ring-primary focus:border-primary': !error
                    }
                    )}
                    {...rest}
                />
                {error && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ExclamationCircleIcon className="w-5 h-5 text-red-500" aria-hidden="true" />
                    </div>
                )}
            </div>
            {error && <span className="text-xs text-red-600">{errorMessage}</span>}
        </div>
    );
});

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
