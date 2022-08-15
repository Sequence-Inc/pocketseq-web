import React, { useState, Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ExclamationIcon } from "@heroicons/react/outline";
import { Spinner } from "@element";
import clsx from "clsx";

interface IProgressModalProps {
    toggle?: Function;
    isOpen?: boolean;
    title?: string;
    Icon?: React.ComponentType<{ className: string }>;
    iconClass?: string;
    progressing?: boolean;
    progressContent?: React.ReactElement;
    succeeded?: boolean;
    succeededContent?: React.ReactElement;
    failed?: boolean;
    failedContent?: React.ReactElement;
    actionButtonClassName?: string;
}

const ProgressModal = (props: IProgressModalProps) => {
    const {
        isOpen,
        toggle,
        title,
        Icon,
        iconClass,
        progressing,
        progressContent,
        succeeded,
        succeededContent,
        failed,
        failedContent,
        actionButtonClassName,
    } = props;

    const content = useMemo(() => {
        if (progressing) return progressContent || <Spinner />;
        if (failed)
            return (
                failedContent || (
                    <div>
                        <p>Failed</p>
                    </div>
                )
            );
        if (succeeded)
            return (
                succeededContent || (
                    <div>
                        <p>Success</p>
                    </div>
                )
            );
    }, [progressing, progressContent, failed, failedContent]);

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {}}>
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

                <div className="fixed z-10 inset-0 overflow-y-auto">
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
                            <Dialog.Overlay className="relative bg-white rounded-lg px-4 py-4 border text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                                {content}
                                {toggle && (
                                    <div className="mt-2 sm:mt-4 flex items-center justify-center">
                                        <button
                                            disabled={progressing}
                                            type="button"
                                            className={clsx(
                                                "inline-flex mt-4 w-full justify-center  rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm",
                                                actionButtonClassName
                                                    ? actionButtonClassName
                                                    : ""
                                            )}
                                            onClick={() => toggle()}
                                        >
                                            OK
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
ProgressModal.defaultProps = {
    isOpen: false,
};
export default ProgressModal;
