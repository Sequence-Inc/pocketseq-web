import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LoadingSpinner } from "@comp";
import { Container, HotelCalendarViewStock } from "@element";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
    ADD_ROOM_STOCK_OVERRIDE,
    REMOVE_ROOM_STOCK_OVERRIDE,
    ROOM_AND_ROOM_OVERRIDE,
} from "src/apollo/queries/hotel.queries";
import AlertModal from "src/components/AlertModal";
import HostLayout from "src/layouts/HostLayout";
import { ModalData, config, generateAlertModalContent } from "src/utils";
import requireAuth from "src/utils/authecticatedRoute";

const DailyOverride = ({ userSession, roomId, hotelId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<ModalData | null>(null);

    const { data, loading, error } = useQuery(ROOM_AND_ROOM_OVERRIDE, {
        variables: {
            roomId,
            hotelId,
        },
        nextFetchPolicy: "network-only",
    });

    const [addRoomStockOverride] = useMutation(ADD_ROOM_STOCK_OVERRIDE, {
        onCompleted(data) {
            setModalData({
                intent: "SUCCESS",
                title: "在庫の上書きが追加されました",
                text: data.addStockOverrideInHotelRoom.message,
                onConfirm: () => {
                    window.location.reload();
                },
            });
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
    const [removeRoomStockOverride] = useMutation(REMOVE_ROOM_STOCK_OVERRIDE, {
        onCompleted(data) {
            setModalData({
                intent: "SUCCESS",
                title: "在庫の上書きが削除されました",
                text: data.removeStockOverrideFromHotelRoom.message,
                onConfirm: () => {
                    window.location.reload();
                },
            });
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

    const addStockOverride = (overrideData) => {
        try {
            setModalData({ ...modalData, intent: "LOADING" });
            setIsModalOpen(true);

            addRoomStockOverride({
                variables: {
                    hotelRoomId: data?.hotelRoomById.id,
                    stockOverride: overrideData,
                },
            });
            // alert("Override added successfully.");
            // location.reload();
            return false;
        } catch (error) {
            console.log(error);
        }
    };

    const deleteStockOverride = (overrideId) => {
        setModalData({
            intent: "DELETE_PRICE_OVERRIDE",
            title: "在庫の上書きを消す？",
            text: "この操作により、上書き情報が削除されます。この操作は元に戻すことができません。",
            onConfirm: () => {
                setModalData({ ...modalData, intent: "LOADING" });
                setIsModalOpen(true);

                removeRoomStockOverride({
                    variables: {
                        hotelRoomId: data?.hotelRoomById.id,
                        stockOverrideIds: [overrideId],
                    },
                });
            },
        });
        setIsModalOpen(true);
    };

    const room = data?.hotelRoomById;
    const stockOverride = data?.stockOverridesByHotelRoomId;

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>
                    部屋在庫上書き | {room.name} | {config.appName}
                </title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 ">
                <div className="bg-white rounded-lg shadow-lg px-6 py-8 pt-4">
                    <div className="w-full space-y-3">
                        <h2 className="text-lg text-gray-600 font-bold border-b border-gray-100 pb-4">
                            在庫の上書き {room.name}
                        </h2>

                        <HotelCalendarViewStock
                            defaultStock={room.stock}
                            stockOverride={stockOverride}
                            addStockOverride={addStockOverride}
                            deleteStockOverride={deleteStockOverride}
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
                roomId: context.query.roomid,
                hotelId: context.query.hotelid,
            },
        };
    }
};
