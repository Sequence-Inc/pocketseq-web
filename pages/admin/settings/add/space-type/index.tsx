import Head from "next/head";
import HostLayout from "src/layouts/HostLayout";
import { useMutation } from "@apollo/client";
import { Container, TextField, PhotoUploadField, Button } from "@element";

import { ADD_SPACE_TYPE } from "src/apollo/queries/admin.queries";
import { ModalData, config, generateAlertModalContent } from "src/utils";
import { useMemo, useState } from "react";
import { GET_ALL_SPACE_TYPES } from "src/apollo/queries/space.queries";
import axios from "axios";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import AlertModal from "src/components/AlertModal";

function SpaceTypeAdd({ userSession }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<ModalData | null>(null);

    const [addSpaceType, { error }] = useMutation(ADD_SPACE_TYPE);

    const modalContent = useMemo(() => {
        return generateAlertModalContent({
            modalData,
            setModalData,
            setIsModalOpen,
        });
    }, [
        modalData?.intent,
        modalData?.text,
        modalData?.title,
        modalData?.onConfirm,
    ]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setModalData({ ...modalData, intent: "LOADING" });
        setIsModalOpen(true);

        // check and prepare data
        if (
            title.trim() === "" ||
            description.trim() === "" ||
            photo === null
        ) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: "すべての情報が必要です。",
            });
            setIsModalOpen(true);
            setLoading(false);
            return;
        }

        // first add space type
        const { data, errors } = await addSpaceType({
            variables: {
                input: {
                    title: title.trim(),
                    description: description.trim(),
                    coverPhotoMime: photo.type,
                },
            },
            refetchQueries: [{ query: GET_ALL_SPACE_TYPES }],
        });

        if (errors) {
            console.log("Errors", errors);
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            setIsModalOpen(true);
            setLoading(false);

            return;
        }
        if (data) {
            const { url, mime } = data.addSpaceType.upload;
            const options = {
                headers: {
                    "Content-Type": mime,
                },
            };
            await axios.put(url, photo, options);

            setModalData({
                intent: "SUCCESS",
                title: "スペースタイプが追加されました",
                text: data.addSpaceType.message,
                onConfirm: () => {
                    window.history.back();
                },
            });
            setIsModalOpen(true);
            setLoading(false);
        }
    };

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>スペースタイプ登録 - {config.appName}</title>
            </Head>
            <div className="bg-white shadow">
                <Container>
                    <div className="py-6 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Profile */}
                            <div className="flex items-center">
                                <div>
                                    <div className="flex items-center">
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            スペースタイプ登録
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8">
                <div className="w-full sm:px-0">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-2">
                        <div className="px-4 py-5 space-y-4">
                            <div>
                                <TextField
                                    value={title}
                                    label="スペースタイプ名"
                                    // error={}
                                    errorMessage="スペースタイプ名は必須です。"
                                    disabled={loading}
                                    onChange={(event) => {
                                        setTitle(event.target.value);
                                    }}
                                    singleRow
                                />
                            </div>
                            <div>
                                <TextField
                                    value={description}
                                    label="紹介文"
                                    // error={}
                                    errorMessage="紹介文は必須です。"
                                    disabled={loading}
                                    onChange={(event) => {
                                        setDescription(event.target.value);
                                    }}
                                    singleRow
                                />
                            </div>
                            <div>
                                <PhotoUploadField
                                    label="画像"
                                    // error={}
                                    errorMessage="画像は必須です。"
                                    disabled={loading}
                                    onChange={(photo) => setPhoto(photo)}
                                    singleRow
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="primary"
                                    className="w-auto"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                >
                                    スペースタイプ追加
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <AlertModal
                isOpen={isModalOpen}
                disableTitle={true}
                disableDefaultIcon={true}
                setOpen={() => {
                    setIsModalOpen(false);
                    setModalData(null);
                }}
                disableClose={true}
            >
                <div className="text-sm text-gray-500">{modalContent}</div>
            </AlertModal>
        </HostLayout>
    );
}

export default SpaceTypeAdd;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["admin"],
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
