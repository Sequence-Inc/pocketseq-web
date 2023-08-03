import Head from "next/head";
import { Switch } from "@headlessui/react";
import HostLayout from "src/layouts/HostLayout";
import { useMutation, useQuery } from "@apollo/client";
import { Container, TextField, PhotoUploadField, Button } from "@element";

import {
    SPACETYPE_BY_ID,
    UPDATE_SPACE_TYPE_BASIC,
    UPDATE_SPACE_TYPE_WITH_PHOTO,
    SPACE_TYPES,
} from "src/apollo/queries/admin.queries";
import { NetworkHelper } from "@comp";
import {
    ModalData,
    classNames,
    config,
    generateAlertModalContent,
} from "src/utils";
import { useMemo, useState } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import AlertModal from "src/components/AlertModal";

function SpaceTypeUpdate({ userSession, spaceTypeId }) {
    // get data for accountID this
    const { data, loading, error } = useQuery(SPACETYPE_BY_ID, {
        variables: { id: spaceTypeId },
    });

    if (loading) return <NetworkHelper type="loading" />;
    if (error) return <NetworkHelper type="error" />;

    const {
        id,
        title: CS_title,
        description: CS_description,
        photo: CS_photo,
        available: CS_available,
    } = data.spaceTypeById;

    const [title, setTitle] = useState(CS_title || "");
    const [description, setDescription] = useState(CS_description || "");
    const [photo, setPhoto] = useState(null);
    const [available, setAvailable] = useState(CS_available);
    const [networkRequestHappening, setNetworkRequestHappening] =
        useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<ModalData | null>(null);

    const [updateBasic] = useMutation(UPDATE_SPACE_TYPE_BASIC, {
        refetchQueries: [{ query: SPACE_TYPES }],
        onCompleted(data) {
            setNetworkRequestHappening(false);
            setModalData({
                intent: "SUCCESS",
                title: "スペースタイプを更新されました",
                text: "スペースタイプを更新されました",
                onConfirm: () => {
                    window.history.back();
                },
            });
            setIsModalOpen(true);
        },
        onError(error) {
            setNetworkRequestHappening(false);
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            setIsModalOpen(true);
        },
    });
    const [updateWithPhoto] = useMutation(UPDATE_SPACE_TYPE_WITH_PHOTO, {
        refetchQueries: [{ query: SPACE_TYPES }],
        onError(error) {
            setNetworkRequestHappening(false);
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            setIsModalOpen(true);
        },
    });

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

        if (title.trim() === "" || description.trim() === "") {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: "スペースタイプ名又は紹介文を空にすることはできません。",
            });
            setIsModalOpen(true);
            return;
        }
        const basicInput = {
            id,
            title,
            description,
            available,
        };
        setNetworkRequestHappening(true);
        setModalData({ ...modalData, intent: "LOADING" });
        setIsModalOpen(true);
        if (photo === null) {
            // call mutation with basic data only
            await updateBasic({ variables: { basicInput } });
        } else {
            // call mutation with basic data and photo
            const photoInput = {
                spaceTypeId: id,
                mime: photo.type,
            };
            const { data } = await updateWithPhoto({
                variables: { basicInput, photoInput },
            });
            if (data?.updateSpaceTypePhoto) {
                console.log("finished request");
                const { url, mime } = data.updateSpaceTypePhoto;
                const options = {
                    headers: {
                        "Content-Type": mime,
                    },
                };
                console.log("uploading photo");
                await axios.put(url, photo, options);
                console.log("upload photo complete");

                setNetworkRequestHappening(false);
                setModalData({
                    intent: "SUCCESS",
                    title: "スペースタイプを更新されました",
                    text: "スペースタイプを更新されました",
                    onConfirm: () => {
                        window.history.back();
                    },
                });
                setIsModalOpen(true);
            }
        }
    };

    const currentPhoto = () => {
        if (!CS_photo?.medium?.url) {
            return <div className="">No photo</div>;
        } else {
            return (
                <div className="">
                    <img
                        src={CS_photo?.medium?.url}
                        className="h-48 w-full object-contain"
                    />
                </div>
            );
        }
    };

    const toggleAvailable = () => {
        setAvailable(!available);
    };

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>スペースタイプ編集 - {config.appName}</title>
            </Head>
            <div className="bg-white shadow">
                <Container>
                    <div className="py-6 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Profile */}
                            <div className="flex items-center">
                                {/* <div className="hidden w-16 h-16 border rounded-lg shadow-sm sm:flex sm:justify-center sm:items-center">
                                    <ViewListIcon className="w-10 h-10 text-primary" />
                                </div> */}
                                <div>
                                    <div className="flex items-center">
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            スペースタイプ編集 - {title}
                                        </h1>
                                    </div>
                                    <div className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                        <div className="flex items-center mt-3 text-sm font-medium text-gray-500 sm:mr-6 sm:mt-0">
                                            {description}
                                        </div>
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
                                    disabled={networkRequestHappening}
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
                                    disabled={networkRequestHappening}
                                    onChange={(event) => {
                                        setDescription(event.target.value);
                                    }}
                                    singleRow
                                />
                            </div>
                            <div>
                                <div className="ml-60 px-4 sm:w-96">
                                    <div className="text-gray-700 mt-4 mb-2 text-center">
                                        {currentPhoto()}
                                    </div>
                                </div>
                                <PhotoUploadField
                                    label="画像"
                                    errorMessage="画像は必須です。"
                                    disabled={networkRequestHappening}
                                    onChange={(photo) => setPhoto(photo)}
                                    singleRow
                                />
                            </div>
                            <div>
                                <div
                                    className={classNames(
                                        "sm:space-x-4 flex-none sm:flex items-center"
                                    )}
                                >
                                    <label
                                        htmlFor={id}
                                        className={classNames(
                                            "block text-sm font-bold text-gray-700",
                                            "sm:text-right w-60"
                                        )}
                                    >
                                        利用可能
                                    </label>
                                    <div
                                        className={classNames(
                                            "relative rounded-md",
                                            "sm:w-96"
                                        )}
                                    >
                                        <Switch
                                            checked={available}
                                            onChange={toggleAvailable}
                                            className={classNames(
                                                available
                                                    ? "bg-primary"
                                                    : "bg-gray-200",
                                                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                            )}
                                        >
                                            <span className="sr-only">
                                                Available
                                            </span>
                                            <span
                                                aria-hidden="true"
                                                className={classNames(
                                                    available
                                                        ? "translate-x-5"
                                                        : "translate-x-0",
                                                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                                )}
                                            />
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="primary"
                                    className="w-auto"
                                    disabled={networkRequestHappening}
                                    onClick={handleSubmit}
                                >
                                    スペースタイプ更新
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

export default SpaceTypeUpdate;

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
        const { spaceTypeId } = context.query;
        return {
            props: {
                userSession,
                spaceTypeId,
            },
        };
    }
};
