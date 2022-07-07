import React from "react";
import useTranslation from "next-translate/useTranslation";
import { TAddHotelProps } from "@appTypes/timebookTypes";
import { useQuery, NetworkStatus } from "@apollo/client";
import { ROOMS_BY_HOTEL_ID } from "src/apollo/queries/hotel.queries";
import { useToast } from "@hooks/useToasts";
import RoomList from "./RoomList";

interface IRoomFormProps extends TAddHotelProps {}

const Rooms = ({ setActiveTab, activeTab, hotelId }: IRoomFormProps) => {
    const { t } = useTranslation("adminhost");
    const { addAlert } = useToast();
    const { data, loading, error, networkStatus } = useQuery(
        ROOMS_BY_HOTEL_ID,
        {
            variables: {
                hotelId,
            },
            skip: !hotelId,
        }
    );

    return (
        <div>
            <RoomList
                data={data?.myHotelRooms}
                loading={loading}
                refetching={networkStatus === NetworkStatus.refetch}
            />
        </div>
    );
};

export default Rooms;
