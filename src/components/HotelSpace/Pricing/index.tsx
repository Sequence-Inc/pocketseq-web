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
import {
    THotelRoom,
    IColumns,
    TTableKey,
    THotelPriceScheme,
} from "@appTypes/timebookTypes";
import { PRICE_SCHEME_ADULTS, PRICE_SCHEME_CHILD } from "@config";
import { Table } from "@element";
import { LoadingSpinner } from "src/components/LoadingSpinner";

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

    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [loadComplete, setLoadComplete] = useState<boolean>(false);

    const columnClassName = (key): string | undefined => {
        return "text-center text-xs border w-10 px-0";
    };

    const childClassname = (key): string => {
        const commonClass = "border text-center";

        return commonClass;
    };

    const handleCreateTable = useCallback(() => {
        if (!hotelRooms?.myHotelRooms?.length) {
            return;
        }

        const maxAdultCapacity = Math.max(
            ...hotelRooms?.myHotelRooms?.map(
                (room) => room?.maxCapacityAdult || 0
            )
        );

        // const maxAdultCapacity = 10;

        const maxChildCapacity = Math.max(
            ...hotelRooms?.myHotelRooms?.map(
                (room) => room?.maxCapacityChild || 0
            )
        );

        // const maxChildCapacity = 10;

        const keys: TTableKey[] = [
            { name: "", key: "name" },
            { name: "Room Charge", key: "roomCharge" },
        ];

        for (
            let i = 0;
            i < (maxAdultCapacity <= 10 ? maxAdultCapacity : 10);
            i++
        ) {
            keys.push(PRICE_SCHEME_ADULTS[i]);
        }

        for (
            let i = 0;
            i < (maxChildCapacity <= 10 ? maxChildCapacity : 10);
            i++
        ) {
            keys.push(PRICE_SCHEME_CHILD[i]);
        }

        const newData: IColumns[] = keys.map(({ name, key }: TTableKey) => ({
            Header: name.toUpperCase(),
            accessor: key,
            className: columnClassName(key),
            childClassName: childClassname(key),
            Cell: ({ column, row, value }) => {
                if (column?.id === "name") {
                    return (
                        <div className="text-left">
                            <a className="text-gray-600 hover:text-gray-700">
                                {value}
                            </a>
                        </div>
                    );
                }
                return value;
            },
        }));

        const filteredNewData = newData.filter((res) => res !== undefined);
        setColumns(filteredNewData);
        setLoadComplete(true);

        return () => {};
    }, [hotelRooms?.myHotelRooms]);

    useEffect(() => {
        handleCreateTable();
    }, [handleCreateTable]);

    useEffect(() => {
        return () => setFormVisible(false);
    }, []);
    let content;
    if (loading || pricingLoading) {
        content = <LoadingSpinner loadingText="Loading Rooms..." />;
    }

    if (loadComplete && hotelRooms?.myHotelRooms?.length) {
        content = (
            <Table
                columns={columns}
                data={pricingDatas?.myPriceSchemes || []}
                hidePagination
            />
        );
    }
    return (
        <>
            <Container className="py-4 text-gray-700">{content}</Container>
        </>
    );
};

export default Pricing;
