import React, { useState } from "react";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container } from "@element";
import { useMutation, useQuery } from "@apollo/client";
import requireAuth from "src/utils/authecticatedRoute";
import { getSession } from "next-auth/react";
import { config, PriceFormatter } from "src/utils";
import {
    CANCEL_SUBSCRIPTION,
    MY_SUBSCRIPTIONS,
} from "src/apollo/queries/subscriptions/queries";
import moment from "moment-timezone";
import { LoadingSpinner } from "@comp";
import AlertModal from "src/components/AlertModal";
import { useModalDialog } from "@hooks/useModalDialog";

const UserSettings = ({ userSession }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { data, loading, error, refetch } = useQuery(MY_SUBSCRIPTIONS);
    const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION, {
        onCompleted: (data) => {
            setModalData({
                intent: "SUCCESS",
                title: "サブスクリプションがキャンセルされました",
                text: data.cancelSubscription.message,
            });
            openModal();
            refetch();
            setIsLoading(false);
        },
        onError: (error) => {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            openModal();
            setIsLoading(false);
        },
    });

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

    if (loading) {
        return (
            <div className="my-20">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return <div>エラー: {error.message}</div>;
    }

    const { mySubscriptions } = data;

    const _cancelSubscription = ({ name, priceType, type, id }) => {
        setModalData({
            intent: "CONFIRM",
            title: "サブスクリプションをキャンセルする",
            text: `購読を解除してもよろしいですか?`,
            onConfirm: () => {
                setIsLoading(true);
                cancelSubscription({ variables: { id } });
            },
        });
        openModal();
    };

    const renderStatus = ({
        currentPeriodEnd,
        isCanceled,
        endsAt,
        canceledAt,
    }) => {
        if (!isCanceled) {
            return (
                <div className="space-y-1">
                    <div>
                        スターテス:{" "}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            アクティブ
                        </span>
                    </div>
                    <div>
                        更新日:{" "}
                        {moment(currentPeriodEnd).format("YYYY年MM月DD日")}
                    </div>
                </div>
            );
        } else {
            if (moment(endsAt).isAfter(moment())) {
                // pending cancellation
                return (
                    <div className="space-y-1">
                        <div>
                            スターテス:{" "}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                キャンセル保留中
                            </span>
                        </div>
                        <div>
                            キャンセル日:{" "}
                            {moment(canceledAt).format("YYYY年MM月DD日")}
                        </div>
                        <div>
                            終了日: {moment(endsAt).format("YYYY年MM月DD日")}
                        </div>
                    </div>
                );
            } else {
                // cancelled
                return (
                    <div className="space-y-1">
                        <div>
                            スターテス:{" "}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                キャンセル
                            </span>
                        </div>
                        <div>
                            キャンセル日:{" "}
                            {moment(canceledAt).format("YYYY年MM月DD日")}
                        </div>
                    </div>
                );
            }
        }
    };

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>サブスクリプション - {config.appName}</title>
            </Head>
            <Container className="w-full sm:w-2/3 sm:mx-auto py-4 sm:py-6 lg:py-8 space-y-6">
                <h2 className="text-lg font-bold leading-6 text-gray-900">
                    サブスクリプション
                </h2>
                <div className="w-full overflow-hidden bg-white rounded-lg shadow">
                    <div className="divide-y">
                        {mySubscriptions.length > 0 &&
                            mySubscriptions.map((subscription, index) => {
                                const {
                                    id,
                                    name,
                                    priceType,
                                    type,
                                    remainingUnit,
                                    unit,
                                    amount,
                                    isCanceled,
                                } = subscription;
                                return (
                                    <div
                                        key={index}
                                        className="py-4 px-4 sm:px-6 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="text-lg font-bold">
                                                {type === "hotel"
                                                    ? "宿泊"
                                                    : "レンタルスペース"}
                                                {" - "}
                                                {name} {priceType}
                                            </div>
                                            <div>
                                                <span className="font-bold text-lg">
                                                    {PriceFormatter(amount)}
                                                </span>
                                                /月
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-right text-gray-600">
                                                {unit - remainingUnit}/{unit}
                                                {type === "hotel"
                                                    ? "泊"
                                                    : "時間"}
                                            </div>
                                            <div className="relative w-full h-3 bg-gray-100 rounded overflow-hidden">
                                                <div
                                                    className={`h-3 bg-primary`}
                                                    style={{
                                                        width: `${
                                                            ((unit -
                                                                remainingUnit) /
                                                                unit) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                {renderStatus(subscription)}
                                            </div>
                                            <div>
                                                {!isCanceled && (
                                                    <button
                                                        type="button"
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                        onClick={() => {
                                                            _cancelSubscription(
                                                                subscription
                                                            );
                                                        }}
                                                    >
                                                        キャンセル
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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

export default UserSettings;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/api/auth/signin",
        roles: ["user"],
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
