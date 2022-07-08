import React, { useState, useEffect, useCallback } from "react";
import { TAddHotelProps } from "@appTypes/timebookTypes";
import {
    ROOMS_BY_HOTEL_ID,
    PRICING_BY_HOTEL_ID,
} from "src/apollo/queries/hotel.queries";
import { useQuery, NetworkStatus } from "@apollo/client";
import useTranslation from "next-translate/useTranslation";

import { Table, Container } from "@element";
import { THotelRoom, IColumns, TTableKey } from "@appTypes/timebookTypes";
import { PencilAltIcon } from "@heroicons/react/outline";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import { PRICE_SCHEME_ADULTS, PRICE_SCHEME_CHILD } from "@config";

interface IPricingFormProps extends TAddHotelProps {
    hotelId: string;
}

const Pricing = ({ hotelId, activeTab, setActiveTab }: IPricingFormProps) => {
    const [maxAdults, setMaxAdults] = useState<number | undefined>();
    const [maxChilds, setMaxChilds] = useState<number | undefined>();

    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [loadComplete, setLoadComplete] = useState<boolean>(false);

    const { t } = useTranslation("adminhost");
    const { data, loading, error, networkStatus } = useQuery(
        ROOMS_BY_HOTEL_ID,
        {
            variables: {
                hotelId,
            },
            skip: !hotelId,
        }
    );
    const {
        data: pricingDatas,
        loading: pricingLoading,
        error: pricingErrors,
    } = useQuery(PRICING_BY_HOTEL_ID, {
        variables: {
            hotelId,
        },
        skip: !hotelId,
    });

    const columnClassName = (key): string | undefined => {
        return "text-center border text-base font-light w-20  px-0";
    };

    const childClassname = (key): string => {
        const commonClass = "border text-center";

        return commonClass;
    };

    const handleCreateTable = useCallback(() => {
        if (!data?.myHotelRooms?.length) {
            return;
        }

        const maxAdultCapacity = Math.max(
            ...data.myHotelRooms.map((room) => room?.maxCapacityAdult || 0)
        );
        const maxChildCapacity = Math.max(
            ...data.myHotelRooms.map((room) => room?.maxCapacityChild || 0)
        );
        setMaxAdults(maxAdultCapacity);
        setMaxChilds(maxChildCapacity);

        const keys: TTableKey[] = [{ name: "", key: "name" }];

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
                            {/* <Link
                                href={`/host/my-space/edit/${row?.original?.id}/view`}
                            > */}
                            <a className="text-gray-600 hover:text-gray-700">
                                {value}
                            </a>
                            {/* </Link> */}
                        </div>
                    );
                }
                return value;
            },
        }));

        // newData.push({
        //     Header: "ACTION",
        //     accessor: "action",
        //     Cell: ({ row }: { row: any }) => {
        //         return (
        //             <div className="flex items-center justify-center space-x-2">
        //                 <button
        //                     className="flex items-center shadow text-sm focus:outline-none bg-gray-100 px-3 py-1 rounded  text-gray-500 hover:text-gray-700 cursor-not-allowed"
        //                     // hover:bg-gray-200
        //                     // onClick={() => {
        //                     //     router.push(
        //                     //         `/host/my-space/edit/${row.original.id}/view`
        //                     //     );
        //                     // }}
        //                 >
        //                     <PencilAltIcon className="w-4 h-4 text-gray-400 mr-1" />
        //                     確認
        //                 </button>
        //             </div>
        //         );
        //     },
        // });
        const filteredNewData = newData.filter((res) => res !== undefined);
        setColumns(filteredNewData);
        setLoadComplete(true);

        return () => {
            setMaxAdults(null);
            setMaxChilds(null);
        };
    }, [data?.myHotelRooms]);

    useEffect(() => {
        handleCreateTable();
    }, [handleCreateTable]);

    let content;
    if (loading) {
        content = <LoadingSpinner loadingText="Loading Rooms..." />;
    }

    if (loadComplete && data?.myHotelRooms?.length) {
        content = (
            <Table
                columns={columns}
                data={pricingDatas?.myPriceSchemes || []}
            />
        );
    }

    return <Container className="py-4 text-gray-700">{content}</Container>;
};

export default Pricing;
