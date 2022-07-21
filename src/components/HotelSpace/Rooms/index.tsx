import React, { useEffect, useState, useRef } from "react";
import useTranslation from "next-translate/useTranslation";
import { TAddHotelProps } from "@appTypes/timebookTypes";
import { useQuery, NetworkStatus } from "@apollo/client";
import { ROOMS_BY_HOTEL_ID } from "src/apollo/queries/hotel.queries";
import { useToast } from "@hooks/useToasts";
import RoomList from "./RoomList";
import { Button, Container } from "@element";
import { PlusIcon, XIcon } from "@heroicons/react/outline";
import AddRoomForm from "./AddRoomsForm";

interface IRoomFormProps extends TAddHotelProps {}

const Rooms = ({ setActiveTab, activeTab, hotelId }: IRoomFormProps) => {
    const { t } = useTranslation("adminhost");
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const { addAlert } = useToast();

    const toggleForm = () => setFormVisible((prev) => !prev);
    const { data, loading, error, networkStatus } = useQuery(
        ROOMS_BY_HOTEL_ID,
        {
            variables: {
                hotelId,
            },
            skip: !hotelId,
        }
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
        addAlert({ type: "success", message: "Successfully added hotel room" });
    };
    return (
        <>
            <div className="flex md:justify-end">
                <div className="flex px-6 mt-6 space-x-3 md:mt-0 md:ml-4">
                    {!formVisible && (
                        <Button
                            variant="primary"
                            Icon={PlusIcon}
                            onClick={toggleForm}
                        >
                            {t("add-hotel")}
                        </Button>
                    )}
                </div>
            </div>

            {!formVisible && (
                <div className="mb-5">
                    <RoomList
                        data={data?.myHotelRooms}
                        loading={loading}
                        refetching={networkStatus === NetworkStatus.refetch}
                        setFormData={setFormData}
                    />

                    <div className="flex justify-start w-full ">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleNext}
                            className="font-medium border-l text-sm w-16 bg-indigo-500 hover:bg-indigo-300"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
            {formVisible && (
                <AddRoomForm
                    hotelId={hotelId}
                    handleSubmit={handleSubmit}
                    toggleForm={closeForm}
                    initialValue={defaultFormData}
                />
            )}
        </>
    );
};

export default Rooms;
