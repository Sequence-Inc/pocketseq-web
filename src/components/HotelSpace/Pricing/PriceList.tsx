import React, { useState, useCallback, useEffect } from "react";
import {
    THotelRoom,
    IColumns,
    TTableKey,
    THotelPriceScheme,
} from "@appTypes/timebookTypes";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import { PRICE_SCHEME_ADULTS, PRICE_SCHEME_CHILD } from "@config";
import { Table } from "@element";

interface IPriceListProps {
    hotelRooms?: THotelRoom[];
    pricingData?: THotelPriceScheme[];
    roomsLoading?: boolean;
    priceLoading?: boolean;
    refetching?: boolean;
}

const PriceList = ({
    hotelRooms,
    roomsLoading,
    refetching,
    priceLoading,
    pricingData,
}: IPriceListProps) => {
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
        if (!hotelRooms?.length) {
            return;
        }

        const maxAdultCapacity = Math.max(
            ...hotelRooms.map((room) => room?.maxCapacityAdult || 0)
        );
        const maxChildCapacity = Math.max(
            ...hotelRooms.map((room) => room?.maxCapacityChild || 0)
        );

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
    }, [hotelRooms]);

    useEffect(() => {
        handleCreateTable();
    }, [handleCreateTable]);

    let content;
    if (roomsLoading || priceLoading) {
        content = <LoadingSpinner loadingText="Loading Rooms..." />;
    }

    if (loadComplete && hotelRooms?.length) {
        content = <Table columns={columns} data={pricingData || []} />;
    }
    return <div>{content}</div>;
};

export default PriceList;
