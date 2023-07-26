import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { TAddHotelProps } from "@appTypes/timebookTypes";
import { useQuery, NetworkStatus } from "@apollo/client";

import { useToast } from "@hooks/useToasts";
import RoomList from "./RoomList";
import { Button } from "@element";
import { PlusIcon } from "@heroicons/react/outline";
import AddRoomForm from "./AddRoomsForm";

import { Room as RoomQueires } from "src/apollo/queries/hotel";

const { queries: roomQueries } = RoomQueires;
interface IRoomFormProps extends TAddHotelProps {}

const noOfItems = 10;

const Rooms = ({ setActiveTab, activeTab, hotelId }: IRoomFormProps) => {
    const { t } = useTranslation("adminhost");
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const { addAlert } = useToast();
    const [skip, setSkip] = useState<number>(0);

    const toggleForm = () => setFormVisible((prev) => !prev);

    const { data, loading, error, networkStatus, refetch } = useQuery(
        roomQueries.ROOMS_BY_HOTEL_ID,
        {
            variables: {
                hotelId,
                paginate: { take: noOfItems, skip: 0 },
            },
            skip: !hotelId,
        }
    );

    const handlePaginateSpaces = React.useCallback(
        (type: "next" | "prev") => {
            const hasNext = data?.myHotelRooms?.paginationInfo?.hasNext;
            const hasPrevious = data?.myHotelRooms?.paginationInfo?.hasPrevious;

            if (type === "next" && hasNext) {
                refetch({
                    paginate: {
                        take: noOfItems,
                        skip: skip + noOfItems,
                    },
                });
                setSkip(skip + noOfItems);
            } else if (type === "prev" && hasPrevious) {
                refetch({
                    paginate: {
                        take: noOfItems,
                        skip: skip - noOfItems,
                    },
                });
                setSkip(skip - noOfItems);
            }
        },
        [data]
    );

    const [defaultFormData, setDefaultFormData] = useState(null);

    const closeForm = () => {
        toggleForm();
        setDefaultFormData(null);
    };

    const setFormData = (data) => {
        setDefaultFormData(data);
        toggleForm();
    };

    const handleNext = () => {
        setActiveTab(activeTab + 1);
    };
    const handleSubmit = () => {
        toggleForm();
        addAlert({ type: "success", message: "部屋は追加しました。" });
        refetch();
    };
    return (
        <div className="overflow-auto">
            <div className="flex md:justify-end">
                <div className="flex px-6 mt-6 space-x-3 md:mt-0 md:ml-4">
                    {!formVisible && (
                        <Button
                            variant="primary"
                            Icon={PlusIcon}
                            onClick={toggleForm}
                        >
                            ルームの追加
                        </Button>
                    )}
                </div>
            </div>

            {!formVisible && (
                <div className="mb-5">
                    <RoomList
                        data={data?.myHotelRooms?.data}
                        loading={loading}
                        refetching={networkStatus === NetworkStatus.refetch}
                        setFormData={setFormData}
                    />

                    {/* <div className="flex justify-start w-full ">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleNext}
                            className="font-medium border-l text-sm w-auto flex bg-indigo-500 hover:bg-indigo-300"
                        >
                            次へ
                        </Button>
                    </div> */}
                </div>
            )}
            {formVisible && (
                <AddRoomForm
                    hotelId={hotelId}
                    handleSubmit={handleSubmit}
                    toggleForm={closeForm}
                    selectedRoom={defaultFormData}
                />
            )}
        </div>
    );
};

export default Rooms;
