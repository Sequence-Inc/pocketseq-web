import React, { useState, useEffect, useCallback } from "react";
import { TAddHotelProps } from "@appTypes/timebookTypes";
import {
    ROOMS_BY_HOTEL_ID,
    PRICING_BY_HOTEL_ID,
} from "src/apollo/queries/hotel.queries";
import { useQuery, NetworkStatus } from "@apollo/client";
import useTranslation from "next-translate/useTranslation";
import { Container, Button } from "@element";
import { PencilAltIcon } from "@heroicons/react/outline";
import PricingList from "./PriceList";
import AddPriceScheme from "./AddPriceScheme";
import { PlusIcon, XIcon } from "@heroicons/react/outline";

interface IPricingFormProps extends TAddHotelProps {
    hotelId: string;
}

const Pricing = ({ hotelId, activeTab, setActiveTab }: IPricingFormProps) => {
    const { t } = useTranslation("adminhost");
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const toggleForm = () => setFormVisible((prev) => !prev);

    const {
        data: hotelRooms,
        loading,
        error,
    } = useQuery(ROOMS_BY_HOTEL_ID, {
        variables: {
            hotelId,
        },
        skip: !hotelId,
    });

    const {
        data: pricingDatas,
        loading: pricingLoading,
        error: pricingErrors,
        networkStatus,
        refetch,
    } = useQuery(PRICING_BY_HOTEL_ID, {
        variables: {
            hotelId,
        },
        skip: !hotelId,
    });

    const handleNext = () => {
        setActiveTab(activeTab + 1);
    };

    const handleSubmit = () => {
        toggleForm();
        refetch();
    };

    useEffect(() => {
        return () => setFormVisible(false);
    }, []);

    return (
        <>
            <Container className="py-4 text-gray-700">
                {!formVisible && (
                    <div className="mb-5 space-y-5">
                        <PricingList
                            hotelRooms={hotelRooms?.myHotelRooms}
                            pricingData={pricingDatas?.myPriceSchemes}
                            roomsLoading={loading}
                            priceLoading={pricingLoading}
                            refetching={networkStatus === NetworkStatus.refetch}
                        />

                        <div className="flex justify-start w-full ">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={toggleForm}
                                className="font-medium text-sm px-2 w-40 bg-indigo-100 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-500 focus:ring-0"
                            >
                                Add Price Scheme
                            </Button>
                        </div>
                    </div>
                )}
                {formVisible && (
                    <AddPriceScheme
                        hotelId={hotelId}
                        hotelRooms={hotelRooms?.myHotelRooms}
                        closeForm={toggleForm}
                        onCompleted={handleSubmit}
                    />
                )}
            </Container>
        </>
    );
};

export default Pricing;
