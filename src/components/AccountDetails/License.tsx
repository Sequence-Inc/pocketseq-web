import { useMutation } from "@apollo/client";
import { Button, TextArea } from "@element";
import { Dialog, Transition } from "@headlessui/react";
import {
    CheckCircleIcon,
    QuestionMarkCircleIcon,
    XCircleIcon,
} from "@heroicons/react/outline";
import React, { Fragment, useState } from "react";
import {
    APPROVE_LICENSE,
    REJECT_LICENSE,
} from "src/apollo/queries/admin.queries";
import AlertModal from "../AlertModal";
import { useModalDialog } from "@hooks/useModalDialog";

export const LicenseInfo = ({ account, refetchAccount }) => {
    const [approveLicense] = useMutation(APPROVE_LICENSE);
    const [rejectLicense] = useMutation(REJECT_LICENSE);
    const [isOpen, setIsOpen] = useState(account.host.license.map(() => false));
    const [isLoading, setIsLoading] = useState(false);
    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

    const { license } = account.host;

    if (!license) {
        return (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-2">
                <div className="px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            ライセンスは提出されていません。
                        </div>
                    </dl>
                </div>
            </div>
        );
    }

    const handleReject = async (index, id, remarks) => {
        setIsLoading(true);
        setModalData({ ...modalData, intent: "LOADING" });
        openModal();

        const data = await rejectLicense({ variables: { id, remarks } });
        setModalData({
            intent: "SUCCESS",
            title: "ライセンスが拒否されました",
            text: data.data?.rejectLicense.message,
            onConfirm: async () => {
                await refetchAccount();
                setIsLoading(false);
                handleClose(index);
            },
        });
        openModal();
    };

    const handleApprove = async (index, id) => {
        setIsLoading(true);
        setModalData({ ...modalData, intent: "LOADING" });
        openModal();

        const data = await approveLicense({ variables: { id } });

        setModalData({
            intent: "SUCCESS",
            title: "ライセンスが承認されました",
            text: data.data?.approveLicense.message,
            onConfirm: async () => {
                await refetchAccount();
                setIsLoading(false);
                handleClose(index);
            },
        });
        openModal();
    };

    const handleClose = (index) => {
        const newState = [...isOpen];
        newState[index] = false;
        setIsOpen(newState);
    };
    const handleShow = (index) => {
        const newState = [...isOpen];
        newState[index] = true;
        setIsOpen(newState);
    };

    return (
        <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-2">
                <div className="px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {license.map(
                            (
                                {
                                    id,
                                    type,
                                    approved,
                                    remarks,
                                    photos,
                                    createdAt,
                                },
                                index
                            ) => {
                                return (
                                    <div
                                        key={id}
                                        className="py-4 sm:py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6"
                                    >
                                        <LicenseDialog
                                            licensePhotos={photos}
                                            isOpen={isOpen[index]}
                                            onClose={() => handleClose(index)}
                                            approved={approved}
                                            reject={(remarks) =>
                                                handleReject(index, id, remarks)
                                            }
                                            approve={() =>
                                                handleApprove(index, id)
                                            }
                                            loading={isLoading}
                                        ></LicenseDialog>
                                        <div className="text-sm col-span-3 font-medium text-gray-500">
                                            {type}
                                        </div>
                                        <div className="mt-1 text-sm sm:mt-0">
                                            {approved ? (
                                                <div className="flex items-center text-primary text-sm">
                                                    <CheckCircleIcon className="w-5 h-5 text-primary mr-1" />
                                                    スターテス
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <XCircleIcon className="w-5 h-5 text-gray-400 mr-1" />
                                                    {remarks
                                                        ? "拒否されました"
                                                        : "Not approved"}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-1 text-sm sm:mt-0">
                                            <div className="flex space-x-2">
                                                {photos.map((photo) => {
                                                    return (
                                                        <>
                                                            <img
                                                                key={photo.id}
                                                                src={
                                                                    photo.small
                                                                        .url
                                                                }
                                                                className="h-6 rounded"
                                                            />
                                                        </>
                                                    );
                                                })}{" "}
                                                <button
                                                    type="button"
                                                    className="ml-2"
                                                    onClick={() =>
                                                        handleShow(index)
                                                    }
                                                >
                                                    ライセンスを表示
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-1 text-sm sm:mt-0">
                                            {remarks}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </dl>
                </div>
            </div>
            <AlertModal
                isOpen={isModalOpen}
                disableTitle={true}
                disableDefaultIcon={true}
                setOpen={() => {
                    closeModal();
                    setModalData(null);
                }}
                disableClose={true}
            >
                <div className="text-sm text-gray-500">{modalContent}</div>
            </AlertModal>
        </>
    );
};

const LicenseDialog = ({
    loading,
    licensePhotos,
    approved,
    isOpen,
    onClose,
    approve,
    reject,
}) => {
    const [remarks, setRemarks] = useState("");
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={onClose}
            >
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                ライセンス
                            </Dialog.Title>
                            <div className="mt-2">
                                {licensePhotos.map((photo, index) => {
                                    return (
                                        <img
                                            key={index}
                                            src={photo.large.url}
                                            className="w-auto object-contain"
                                        />
                                    );
                                })}
                            </div>
                            {!approved && (
                                <div className="mt-4">
                                    <TextArea
                                        label="Remarks"
                                        onChange={(event) =>
                                            setRemarks(event.target.value)
                                        }
                                        value={remarks}
                                        disabled={loading}
                                    ></TextArea>
                                </div>
                            )}
                            <div className="mt-4 space-x-4">
                                {!approved && (
                                    <>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                                            onClick={() => approve()}
                                            disabled={loading}
                                        >
                                            承認する
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-500 bg-white border border-transparent rounded-md hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-100"
                                            onClick={() => reject(remarks)}
                                            disabled={loading}
                                        >
                                            拒絶
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    キャンセル
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};
