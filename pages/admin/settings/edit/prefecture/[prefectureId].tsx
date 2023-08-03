import Head from "next/head";
import { Switch } from "@headlessui/react";
import withAuth from "src/utils/withAuth";
import HostLayout from "src/layouts/HostLayout";
import { useMutation, useQuery } from "@apollo/client";
import { Container } from "@element";

import {
    UPDATE_PREFECTURE,
    PREFECTURES,
    PREFECTURE_BY_ID,
} from "src/apollo/queries/admin.queries";
import { NetworkHelper } from "@comp";
import {
    ModalData,
    classNames,
    config,
    generateAlertModalContent,
} from "src/utils";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import AlertModal from "src/components/AlertModal";
import { useMemo, useState } from "react";

function PrefectureUpdate({ userSession, prefectureId }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<ModalData | null>(null);

    // get data for accountID this
    const { data, loading, error } = useQuery(PREFECTURE_BY_ID, {
        variables: { id: prefectureId },
    });
    const [updatePrefecture] = useMutation(UPDATE_PREFECTURE, {
        refetchQueries: [{ query: PREFECTURES }],
        onCompleted(data) {
            setModalData({
                intent: "SUCCESS",
                title: "都道府県更新しました",
                text: "都道府県更新しました",
                onConfirm: () => {
                    window.history.back();
                },
            });
            setIsModalOpen(true);
        },
        onError(error) {
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

    if (loading) return <NetworkHelper type="loading" />;
    if (error) return <NetworkHelper type="error" />;

    const { id, name, nameKana, nameRomaji, available } = data.prefectureById;

    const toggleAvailable = (newAvailability) => {
        setModalData({ ...modalData, intent: "LOADING" });
        setIsModalOpen(true);

        updatePrefecture({
            variables: {
                input: { id: parseInt(id, 10), available: newAvailability },
            },
        });
    };

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>都道府県編集 - {config.appName}</title>
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
                                        <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            都道府県編集 - {name}
                                        </h1>
                                    </div>
                                    <div className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                        <div className="flex items-center mt-3 text-sm font-bold text-gray-500 sm:mr-6 sm:mt-0">
                                            {nameRomaji}
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
                        <div className="px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-bold text-gray-500">
                                        名前
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {name}
                                    </dd>
                                </div>
                            </dl>
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-bold text-gray-500">
                                        フリガナ
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {nameKana}
                                    </dd>
                                </div>
                            </dl>
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-bold text-gray-500">
                                        ローマ字
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {nameRomaji}
                                    </dd>
                                </div>
                            </dl>
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-bold text-gray-500">
                                        利用可能
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
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
                                    </dd>
                                </div>
                            </dl>
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

export default withAuth(PrefectureUpdate);

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
        const { prefectureId } = context.query;
        return {
            props: {
                userSession,
                prefectureId,
            },
        };
    }
};
