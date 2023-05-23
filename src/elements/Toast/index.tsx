import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
} from "react";

import { Fragment, useRef } from "react";
import { Transition } from "@headlessui/react";

import { useState } from "react";

import {
    CheckCircleIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";

enum EAlertEnums {
    "success",
    "error",
    "info",
    "warning",
}
interface IAlertProps {
    message?: string;
}

const ToastAlert = forwardRef(({ redirect }: any, ref) => {
    const [show, setShow] = useState<boolean>(false);
    const [message, setMessage] = useState<JSX.Element>();

    const content = useMemo(
        () => ({
            error: (message) => (
                <>
                    <div className="flex-shrink-0">
                        <ExclamationCircleIcon
                            className="h-6 w-6 text-red-400"
                            aria-hidden="true"
                        />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <div className="text-sm font-medium text-gray-900">
                            {message || "Something went wrong"}
                        </div>
                        {/* <div className="mt-1 text-sm text-gray-500">
                                            Anyone with a link can now view this
                                            file.
                                        </div> */}
                    </div>
                </>
            ),

            success: (message) => (
                <>
                    <div className="flex-shrink-0">
                        <CheckCircleIcon
                            className="h-6 w-6 text-green-400"
                            aria-hidden="true"
                        />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <div className="text-sm font-medium text-gray-900">
                            {message || "Action Successful"}
                        </div>
                    </div>
                </>
            ),
        }),
        []
    );

    useImperativeHandle(ref, () => ({
        open: (message) => {
            setMessage(message);
            setShow(true);
        },
        showSuccess: ({ message }: IAlertProps) => {
            setShow(true);
            setMessage(content.success(message));
        },
        showError: ({ message }: IAlertProps) => {
            setShow(true);
            setMessage(content.error(message));
        },

        close: () => {
            setMessage(<></>);
            setShow(false);
        },
    }));

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                setShow(false);
            }, 1500);
        }
    }, [show]);

    return (
        <>
            {/* Global notification live region, render this permanently at the end of the document */}
            <div
                aria-live="assertive"
                className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
            >
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                    <Transition
                        show={show}
                        as={Fragment}
                        enter="transform ease-out duration-300 transition"
                        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-start">
                                    {message}
                                    <div className="ml-4 flex-shrink-0 flex">
                                        <button
                                            type="button"
                                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => {
                                                setShow(false);
                                            }}
                                        >
                                            <span className="sr-only">
                                                Close
                                            </span>
                                            <XIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </>
    );
});

export default ToastAlert;
