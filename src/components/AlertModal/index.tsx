import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ExclamationIcon,
    LockClosedIcon,
    XCircleIcon,
    XIcon,
} from "@heroicons/react/outline";
interface IAlertModalProps {
    toggle?: Function;
    isOpen?: boolean;
    children: React.ReactElement;
    title?: string;
    disableTitle?: boolean;
    disableDefaultIcon?: boolean;
    disableClose?: boolean;
    setOpen?: any;
    Icon?: React.ComponentType<{ className: string }>;
    iconClass?: string;
}

const AlertModal = (props: IAlertModalProps) => {
    const {
        isOpen,
        toggle,
        children,
        title,
        disableDefaultIcon,
        disableTitle,
        disableClose,
        Icon,
        setOpen,
        iconClass,
    } = props;
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-40" onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Overlay className="relative bg-white rounded-lg p-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                                {!disableClose && (
                                    <button
                                        className="absolute z-10 top-3 right-3 outline-white"
                                        onClick={setOpen}
                                    >
                                        <XIcon className="w-6 h-6 text-gray-400 hover:text-gray-500" />
                                    </button>
                                )}
                                <div>
                                    {!disableDefaultIcon && (
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                            {!!Icon && (
                                                <Icon
                                                    className={`${iconClass}`}
                                                />
                                            )}
                                            {!Icon && (
                                                <ExclamationIcon
                                                    className="h-6 w-6 text-red-500"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </div>
                                    )}

                                    <div
                                        className={
                                            !disableTitle
                                                ? "mt-3 text-center sm:mt-5"
                                                : ""
                                        }
                                    >
                                        {!disableTitle && (
                                            <Dialog.Title
                                                as="h3"
                                                className="text-md leading-6 font-medium text-gray-700"
                                            >
                                                {title || "Alert"}
                                            </Dialog.Title>
                                        )}
                                        <div className="">{children}</div>
                                    </div>
                                </div>
                                {toggle && (
                                    <div className="mt-6 sm:mt-6 flex items-center justify-center">
                                        <button
                                            type="button"
                                            className="inline-flex w-24 justify-center  rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                            onClick={() => toggle()}
                                        >
                                            Ok
                                        </button>
                                    </div>
                                )}
                            </Dialog.Overlay>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
AlertModal.defaultProps = {
    isOpen: false,
};
export default AlertModal;
