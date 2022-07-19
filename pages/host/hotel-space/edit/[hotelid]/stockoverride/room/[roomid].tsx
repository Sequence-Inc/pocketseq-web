import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LoadingSpinner } from "@comp";
import { Container, HotelCalendarViewStock } from "@element";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import {
    ADD_ROOM_STOCK_OVERRIDE,
    REMOVE_ROOM_STOCK_OVERRIDE,
    ROOM_AND_ROOM_OVERRIDE,
} from "src/apollo/queries/hotel.queries";
import HostLayout from "src/layouts/HostLayout";
import { config } from "src/utils";
import requireAuth from "src/utils/authecticatedRoute";

const DailyOverride = ({ userSession, roomId, hotelId }) => {
    const { data, loading, error } = useQuery(ROOM_AND_ROOM_OVERRIDE, {
        variables: {
            roomId,
            hotelId,
        },
        nextFetchPolicy: "network-only",
    });

    const [addRoomStockOverride] = useMutation(ADD_ROOM_STOCK_OVERRIDE);
    const [removeRoomStockOverride] = useMutation(REMOVE_ROOM_STOCK_OVERRIDE);

    if (loading) {
        return <LoadingSpinner />;
    }
    if (error) {
        return "Error: " + error?.message;
    }

    const addStockOverride = (overrideData) => {
        try {
            addRoomStockOverride({
                variables: {
                    hotelRoomId: data?.hotelRoomById.id,
                    stockOverride: overrideData,
                },
            });
            alert("Override added successfully.");
        } catch (error) {
            console.log(error);
            alert("Error: " + error.message);
        }
    };

    const deleteStockOverride = (overrideId) => {
        if (
            confirm(
                "Are you sure you want to delete this override setting?"
            ) === true
        ) {
            try {
                removeRoomStockOverride({
                    variables: {
                        hotelRoomId: data?.hotelRoomById.id,
                        priceOverrideIds: [overrideId],
                    },
                });
                alert("Override removed successfully.");
            } catch (error) {
                console.log(error);
                alert("Error: " + error.message);
            }
        }
    };

    const room = data?.hotelRoomById;
    const stockOverride = data?.stockOverridesByHotelRoomId;

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>
                    Room Stock Override | {room.name} | {config.appName}
                </title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 ">
                <div className="bg-white rounded-lg shadow-lg px-6 py-8 pt-4">
                    <div className="w-full space-y-3">
                        <h2 className="text-lg text-gray-600 font-bold border-b border-gray-100 pb-4">
                            Stock Override {room.name}
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
