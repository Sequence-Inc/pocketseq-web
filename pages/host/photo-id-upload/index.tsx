import React, { useState } from "react";
import {
    IdentificationIcon,
    UploadIcon,
    XIcon,
} from "@heroicons/react/outline";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container } from "@element";
import { useMutation } from "@apollo/client";
import { ADD_PHOTO_ID, HOST } from "../../../src/apollo/queries/host.queries";
import axios from "axios";
import router from "next/router";

import useTranslation from "next-translate/useTranslation";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import { config } from "src/utils";
import AlertModal from "src/components/AlertModal";
import { useModalDialog } from "@hooks/useModalDialog";

const PhotoIdUpload = ({ userSession }) => {
    const [loading, setLoading] = useState(null);
    const [photo, setPhoto] = useState(null);

    const { t } = useTranslation("adminhost");

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

    const handleSelectPhoto = (event) => {
        const file = event.target.files[0];
        setPhoto(file);
    };

    const [addPhotoId] = useMutation(ADD_PHOTO_ID, {
        onCompleted: async (data) => {
            try {
                const { url, mime } = data.addPhotoId;
                const options = {
                    headers: {
                        "Content-Type": mime,
                    },
                };
                await axios.put(url, photo, options);
                setLoading(false);
                setPhoto(null);
                setModalData({
                    intent: "SUCCESS",
                    title: "分証明書がアップロードされました",
                    text: "",
                    onConfirm: () => {
                        router.replace("/host");
                    },
                });
                openModal();
            } catch (error) {
                setModalData({
                    intent: "ERROR",
                    title: "エラーが発生しました",
                    text: error.message,
                });
                openModal();
            }
            // now upload the actual photo
        },
        onError: (err) => {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: err.message,
            });
            openModal();
            setLoading(false);
        },
        refetchQueries: [{ query: HOST, fetchPolicy: "network-only" }],
    });

    const handleUpload = () => {
        if (!photo) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: "アップロードするファイルを選択してください。",
            });
            openModal();
            return;
        }
        setLoading(true);
        addPhotoId({ variables: { input: { mime: photo.type } } });
    };

    let content = (
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <svg
                    className="w-12 h-12 mx-auto text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                >
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <div className="flex text-sm text-gray-600">
                    <label
                        htmlFor="file-upload"
                        className="relative font-medium bg-white rounded-md cursor-pointer text-primary hover:text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                        <span>{t("select-photo")}</span>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/jpeg"
                            className="sr-only"
                            onChange={handleSelectPhoto}
                            disabled={loading}
                        />
                    </label>
                    {/* <div className="pl-1">アップロードする</div> */}
                </div>
                <div className="text-xs text-gray-500">
                    JPEGファイルのみ対応
                </div>
            </div>
        </div>
    );

    if (photo) {
        content = (
            <div className="px-6 pt-5 pb-6 overflow-hidden rounded-md">
                <div className="mb-4 text-center">
                    <img
                        src={URL.createObjectURL(photo)}
                        className="object-contain max-h-60"
                    />
                </div>
                <div className="text-right">
                    <button
                        onClick={() => setPhoto(null)}
                        disabled={loading}
                        type="button"
                        className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  ${
                            loading && "opacity-50"
                        }`}
                    >
                        <XIcon
                            className="w-5 h-5 mr-2 -ml-1"
                            aria-hidden="true"
                        />
                        {t("clear")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Upload photo ID - {config.appName}</title>
            </Head>

            <Container className="py-4 space-y-8 sm:py-6 lg:py-8">
                <div className="mx-auto overflow-hidden bg-white rounded-lg shadow sm:max-w-lg">
                    <div className="p-5">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <IdentificationIcon
                                    className="text-gray-500 w-7 h-7"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="flex-1 w-0 ml-5">
                                <h3 className="text-xl font-medium text-gray-700">
                                    アップロードする
                                </h3>
                                <div className="mt-4 text-gray-600">
                                    現在、運転免許証またはパスポートが、政府発行の有効な写真付き身分証明書として認められています。
                                </div>
                                <div className="mt-8 mr-8 sm:max-w-md">
                                    {content}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-3 text-right bg-gray-50">
                        {loading && (
                            <span className="inline-block mr-4 text-gray-500">
                                アップロード中...
                            </span>
                        )}
                        <button
                            disabled={loading}
                            onClick={handleUpload}
                            type="button"
                            className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                loading && "opacity-50"
                            }`}
                        >
                            <UploadIcon
                                className="w-5 h-5 mr-2 -ml-1"
                                aria-hidden="true"
                            />
                            アップロードする
                        </button>
                    </div>
                </div>
            </Container>
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
        </HostLayout>
    );
};

export default PhotoIdUpload;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["host"],
    });
    if (validation !== true) {
        return validation;
    } else {
        return {
            props: {
                userSession,
            },
        };
    }
};
