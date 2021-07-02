import React, { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

interface PasswordInputProps {
    label: string;
    id?: string;
    className?: string;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    tabIndex?: number;
    showForgotPassword?: boolean;
    hintText?: string;
}

const PasswordInput = (props: PasswordInputProps) => {
    const [type, setType] = useState("password");
    const {
        label,
        id,
        className,
        error,
        errorMessage,
        showForgotPassword,
        hintText,
        ...rest
    } = props;
    return (
        <div className={className}>
            <div className="flex flex-wrap items-end justify-between">
                <label
                    htmlFor={id}
                    className="inline-block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
                {showForgotPassword && (
                    <Link href="/forgot-password">
                        <a className="inline-block text-xs font-normal text-gray-500 hover:text-primary">
                            Forgot Password
                        </a>
                    </Link>
                )}
                {hintText && (
                    <span className="text-xs text-gray-500">{hintText}</span>
                )}
            </div>
            <div className="relative mt-1 rounded-md">
                <input
                    id={id}
                    type={type}
                    className={clsx(
                        'appearance-none block w-full px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400',
                        'focus:outline-none sm:text-sm', {
                        'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500': error,
                        'border-gray-300 focus:ring-primary focus:border-primary': !error
                    })}
                    {...rest}
                />
                <div className="absolute h-8 mt-0.5 inset-y-0 right-0 pr-3 mr-1 flex items-center cursor-pointer bg-white">
                    <span
                        className="cursor-pointer"
                        onClick={() =>
                            setType(type === "password" ? "text" : "password")
                        }
                    >
                        {type === "password" ? (
                            <svg
                                className="w-5 h-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                />
                            </svg>
                        )}
                    </span>
                </div>
                {error && (
                    <span className="text-xs text-red-600">{errorMessage}</span>
                )}
            </div>
        </div>
    );
};

export default PasswordInput;
