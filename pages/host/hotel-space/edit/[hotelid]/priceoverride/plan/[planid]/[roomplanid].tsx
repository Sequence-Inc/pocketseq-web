import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LoadingSpinner } from "@comp";
import { Container, HotelCalendarView } from "@element";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useMemo, useState } from "react";
import {
    ADD_PLAN_PRICE_OVERRIDE,
    REMOVE_PLAN_PRICE_OVERRIDE,
    PLAN_AND_PLAN_OVERRIDE,
} from "src/apollo/queries/hotel.queries";
import AlertModal from "src/components/AlertModal";
import HostLayout from "src/layouts/HostLayout";
import { ModalData, config, generateAlertModalContent } from "src/utils";
import requireAuth from "src/utils/authecticatedRoute";

const DailyOverride = ({ userSession, packagePlanId, roomPlanId, hotelId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<ModalData | null>(null);

    const { data, loading, error } = useQuery(PLAN_AND_PLAN_OVERRIDE, {
        variables: {
            roomPlanId,
            packagePlanId,
            hotelId,
        },
        nextFetchPolicy: "network-only",
    });

    const [addPlanPriceOverride] = useMutation(ADD_PLAN_PRICE_OVERRIDE, {
        onCompleted(data) {
            setModalData({
                intent: "SUCCESS",
                title: "料金上書きが追加されました",
                text: data.addPriceOverrideInRoomPlan.message,
                onConfirm: () => {
                    window.location.reload();
                },
            });
            setIsModalOpen(true);
            return false;
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
    const [removePlanPriceOverride] = useMutation(REMOVE_PLAN_PRICE_OVERRIDE, {
        onCompleted(data) {
            setModalData({
                intent: "SUCCESS",
                title: "料金の上書きが削除されました",
                text: data.removePriceOverrideFromRoomPlan.message,
                onConfirm: () => {
                    window.location.reload();
                },
            });
            setIsModalOpen(true);
            return false;
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

    if (loading) {
        return (
            <div className="my-20">
                <LoadingSpinner />
            </div>
        );
    }
    if (error) {
        return "Error: " + error?.message;
    }

    const addPriceOverride = (overrideData) => {
        try {
            setModalData({ ...modalData, intent: "LOADING" });
            setIsModalOpen(true);
            addPlanPriceOverride({
                variables: {
                    roomPlanId,
                    priceOverride: overrideData,
                },
            });
        } catch (error) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            setIsModalOpen(true);
        }
    };

    const doDeletePriceOverride = async (overrideId) => {
        try {
            setModalData({ ...modalData, intent: "LOADING" });
            setIsModalOpen(true);
            removePlanPriceOverride({
                variables: {
                    roomPlanId,
                    priceOverrideIds: [overrideId],
                },
            });
        } catch (error) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            setIsModalOpen(true);
        }
    };

    const deletePriceOverride = (overrideId) => {
        setModalData({
            intent: "DELETE_PRICE_OVERRIDE",
            title: "料金上書きを消す？",
            text: "この操作により、上書き情報が削除されます。この操作は元に戻すことができません。",
            onConfirm: () => {
                doDeletePriceOverride(overrideId);
            },
        });
        setIsModalOpen(true);
    };

    const plan = data?.packagePlanById;
    const priceOverride = data?.priceOverridesByRoomPlanId;
    const priceScheme = data?.myPriceSchemes;

    const basicPriceSetting = plan.roomTypes.filter(
        (_) => _.id === roomPlanId
    )[0].priceSettings;
    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>
                    料金の上書き | {plan.name} | {config.appName}
                </title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 ">
                <div className="bg-white rounded-lg shadow-lg px-6 py-8 pt-4">
                    <div className="w-full space-y-3">
                        <h2 className="text-lg text-gray-600 font-bold border-b border-gray-100 pb-4">
                            料金の上書き 「{plan.name}」
                        </h2>

                        <HotelCalendarView
                            type="plan"
                            priceScheme={priceScheme}
                            basicPriceSetting={basicPriceSetting}
                            priceOverride={priceOverride}
                            addPriceOverride={addPriceOverride}
                            deletePriceOverride={deletePriceOverride}
                            hotelId={hotelId}
                        />
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
};

export default DailyOverride;

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
                roomPlanId: context.query.roomplanid,
                hotelId: context.query.hotelid,
                packagePlanId: context.query.planid,
            },
        };
    }
};
