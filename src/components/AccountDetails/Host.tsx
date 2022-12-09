import React, { Fragment, useState } from "react";
import {
    CheckCircleIcon,
    QuestionMarkCircleIcon,
    XCircleIcon,
} from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@element";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import {
    ACCOUNT_BY_ID,
    APPROVE_ACCOUNT,
} from "src/apollo/queries/admin.queries";
import moment from "moment";

export const HostAccountInfo = ({ account }) => {
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const {
        accountId,
        email,
        emailVerified,
        approved,
        suspended,
        host,
        createdAt,
        updatedAt,
    } = account;

    const [
        approveAccount,
        { data: approveAccountData, error: approveAccountEror },
    ] = useMutation(APPROVE_ACCOUNT, {
        refetchQueries: [
            {
                query: ACCOUNT_BY_ID,
                variables: { accountId },
                fetchPolicy: "network-only",
            },
        ],
    });

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    async function handleApprove() {
        const { data } = await approveAccount({ variables: { accountId } });
        closeModal();
        if (data.approveAccount.message) {
            alert(data.approveAccount.message);
            router.push("/admin/hosts");
        }
    }
    function handleReject() {}

    const {
        id: hostId,
        name,
        type,
        photoId,
        profilePhoto,
        stripeAccountId,
    } = host;

    let approveButton = null;
    let photoIdDialogContent = null;
    let photoIdVerifyContent = (
        <div className="text-gray-500"> (Photo ID not provided yet!)</div>
    );
    if (!approved && photoId?.large?.url) {
        approveButton = (
            <Button
                variant="primary"
                className="w-auto ml-6"
                onClick={openModal}
            >
                Approve Host
            </Button>
        );
        photoIdDialogContent = (
            <PhotoIdDialog
                photoId={photoId}
                isOpen={isOpen}
                onClose={closeModal}
                approve={handleApprove}
                reject={handleReject}
            />
        );
        photoIdVerifyContent = (
            <button
                className="text-blue-500 hover:text-primary ml-4"
                onClick={openModal}
            >
                (Verify Photo ID)
            </button>
        );
    } else {
        photoIdVerifyContent = null;
    }

    return (
        <>
            {photoIdDialogContent}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-2">
                <div className="px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                ホストID
                            </dt>
                            <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                {hostId}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                ホスト名
                            </dt>
                            <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                {name}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                アカウントタイプ
                            </dt>
                            <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                {type === "Corporate" ? "法人" : "個人"}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                ストライプ ID
                            </dt>
                            <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                {stripeAccountId}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                    {email}{" "}
                                    {emailVerified ? (
                                        <div className="flex items-center ml-3 text-primary text-sm">
                                            <CheckCircleIcon className="w-5 h-5 text-primary mr-1" />
                                            承認済み
                                        </div>
                                    ) : (
                                        <div className="flex items-center ml-3 text-gray-500 text-sm">
                                            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400 mr-1" />
                                            未確認
                                        </div>
                                    )}
                                </div>
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                アカウント承認
                            </dt>
                            <dd className="mt-1 flex items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {approved ? (
                                    <div className="flex items-center text-primary text-sm">
                                        <CheckCircleIcon className="w-5 h-5 text-primary mr-1" />
                                        承認済み
                                    </div>
                                ) : (
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <XCircleIcon className="w-5 h-5 text-gray-400 mr-1" />
                                        未承認
                                    </div>
                                )}
                                {photoIdVerifyContent}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                サスペンド
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {suspended ? (
                                    <div className="flex items-center text-red-500 text-sm">
                                        <XCircleIcon className="w-5 h-5 text-red-500 mr-1" />
                                        一時停止
                                    </div>
                                ) : (
                                    <div className="flex items-center text-primary text-sm">
                                        <CheckCircleIcon className="w-5 h-5 text-primary mr-1" />
                                        Not suspended
                                    </div>
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                登録日
                            </dt>
                            <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                {moment(createdAt).format(
                                    "YYYY年MM月DD日 HH:mm"
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                最終更新日
                            </dt>
                            <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                {moment(updatedAt).format(
                                    "YYYY年MM月DD日 HH:mm"
                                )}
                            </dd>
                        </div>
                        <div className="py-4 bg-gray-50 sm:py-5 sm:px-6">
                            <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex flex-row-reverse">
                                {approveButton}
                                <Button
                                    variant="secondary"
                                    className="w-auto bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                                >
                                    ホストをサスペンド
                                </Button>
                            </div>
                        </div>
                    </dl>
                </div>
            </div>
        </>
    );
};

const PhotoIdDialog = ({ photoId, isOpen, onClose, approve, reject }) => {
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
                                身分証明書
                            </Dialog.Title>
                            <div className="mt-2">
                                <img
                                    src={photoId.large.url}
                                    className="h-auto object-contain"
                                />
                            </div>

                            <div className="mt-4 space-x-4">
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                                    onClick={approve}
                                >
                                    承認する
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-500 bg-white border border-transparent rounded-md hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-100"
                                    onClick={reject}
                                >
                                    拒絶
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
                                    onClick={onClose}
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
