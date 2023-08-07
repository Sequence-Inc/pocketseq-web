import { useMutation, useQuery } from "@apollo/client";
import { Dialog, DialogProps, LoadingSpinner } from "@comp";
import { Container, HotelCalendarView } from "@element";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useMemo, useState } from "react";
import {
    ADD_ROOM_PRICE_OVERRIDE,
    REMOVE_ROOM_PRICE_OVERRIDE,
    ROOM_AND_ROOM_OVERRIDE,
} from "src/apollo/queries/hotel.queries";
import AlertModal from "src/components/AlertModal";
import HostLayout from "src/layouts/HostLayout";
import { ModalData, config, generateAlertModalContent } from "src/utils";
import requireAuth from "src/utils/authecticatedRoute";

const DailyOverride = ({ userSession, roomId, hotelId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<ModalData | null>(null);

    const [dialog, setDialog] = useState<DialogProps>({
        isOpen: false,
        type: "info",
        title: "title",
    });

    const handleDialogClose = () => {
        setDialog({ ...dialog, isOpen: false });
    };

    const { data, loading, error } = useQuery(ROOM_AND_ROOM_OVERRIDE, {
        variables: {
            roomId,
            hotelId,
        },
        nextFetchPolicy: "network-only",
    });

    const [addRoomPriceOverride] = useMutation(ADD_ROOM_PRICE_OVERRIDE, {
        onCompleted(data) {
            setModalData({
                intent: "SUCCESS",
                title: "価格の上書きが追加されました",
                text: data.addPriceOverrideInHotelRoom.message,
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
    const [removeRoomPriceOverride] = useMutation(REMOVE_ROOM_PRICE_OVERRIDE, {
        onCompleted(data) {
            setModalData({
                intent: "SUCCESS",
                title: "価格の上書きが削除されました",
                text: data.removePriceOverrideFromHotelRoom.message,
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
            addRoomPriceOverride({
                variables: {
                    hotelRoomId: data?.hotelRoomById.id,
                    priceOverride: overrideData,
                },
            });
        } catch (error) {}
    };

    const doDeletePriceOverride = (overrideId) => {
        try {
            setModalData({ ...modalData, intent: "LOADING" });
            setIsModalOpen(true);
            removeRoomPriceOverride({
                variables: {
                    hotelRoomId: data?.hotelRoomById.id,
                    priceOverrideIds: [overrideId],
                },
            });
        } catch (error) {}
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

    const room = data?.hotelRoomById;
    const priceOverride = data?.priceOverridesByHotelRoomId;
    const stockOverride = data?.stockOverridesByHotelRoomId;
    const priceScheme = data?.myPriceSchemes;

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>
                    Room Price Override | {room.name} | {config.appName}
                </title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 ">
                <div className="bg-white rounded-lg shadow-lg px-6 py-8 pt-4">
                    <div className="w-full space-y-3">
                        <h2 className="text-lg text-gray-600 font-bold border-b border-gray-100 pb-4">
                            料金の上書き {room.name}
                        </h2>
                        <HotelCalendarView
                            type="room"
                            priceScheme={priceScheme}
                            basicPriceSetting={room.basicPriceSettings}
                            priceOverride={priceOverride}
                            addPriceOverride={addPriceOverride}
                            deletePriceOverride={deletePriceOverride}
                            hotelId={hotelId}
                        />
                        <Dialog onClose={handleDialogClose} {...dialog} />
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
                roomId: context.query.roomid,
                hotelId: context.query.hotelid,
            },
        };
    }
};
