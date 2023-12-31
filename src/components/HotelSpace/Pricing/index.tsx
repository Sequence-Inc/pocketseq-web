import React, { useState, useEffect, useCallback } from "react";
import { TAddHotelProps } from "@appTypes/timebookTypes";

import { useQuery } from "@apollo/client";
import useTranslation from "next-translate/useTranslation";
import { Button } from "@element";
import { TTableKey, THotelPriceScheme } from "@appTypes/timebookTypes";
import { PRICE_SCHEME_ADULTS, PRICE_SCHEME_CHILD } from "@config";
import Table from "./component/Table";
import { LoadingSpinner } from "src/components/LoadingSpinner";

import {
    Room as RoomQueires,
    Pricing as PricingQueries,
} from "src/apollo/queries/hotel";

const { queries: roomQueries } = RoomQueires;
const { queries: pricingQueries } = PricingQueries;

interface IPricingFormProps extends TAddHotelProps {
    hotelId: string;
}

const Pricing = ({ hotelId, activeTab, setActiveTab }: IPricingFormProps) => {
    const { t } = useTranslation("adminhost");

    const { data: hotelRooms, loading } = useQuery(
        roomQueries.ROOMS_BY_HOTEL_ID,
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
        refetch,
    } = useQuery(pricingQueries.PRICING_BY_HOTEL_ID, {
        variables: {
            hotelId,
        },
        skip: !hotelId,
    });

    const [tableData, setTableData] = useState<THotelPriceScheme[]>();

    const [columns, setColumns] = useState<TTableKey[] | undefined>();
    const [loadComplete, setLoadComplete] = useState<boolean>(false);

    const handleCreateTable = useCallback(() => {
        if (pricingLoading) return setTableData([]);
        if (!hotelRooms?.myHotelRooms?.data?.length) {
            return;
        }

        const maxAdultCapacity = Math.max(
            ...hotelRooms?.myHotelRooms?.data?.map(
                (room) => room?.maxCapacityAdult || 0
            )
        );

        const maxChildCapacity = Math.max(
            ...hotelRooms?.myHotelRooms?.data?.map(
                (room) => room?.maxCapacityChild || 0
            )
        );

        const keys: TTableKey[] = [
            { name: "", key: "name" },
            { name: "部屋料金", key: "roomCharge" },
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

        setColumns(keys);

        setTableData(pricingDatas?.myPriceSchemes || []);
        setLoadComplete(true);

        return () => {};
    }, [
        hotelRooms?.myHotelRooms?.data,
        pricingDatas?.myPriceSchemes,
        pricingLoading,
    ]);

    const handleRemoveRow = useCallback(
        (rowId: number) => {
            const newRows = [...tableData].filter(
                (_, index) => index !== rowId
            );
            setTableData(newRows);
        },
        [tableData]
    );

    useEffect(() => {
        handleCreateTable();
    }, [handleCreateTable]);

    let content;
    if (loading || pricingLoading) {
        content = <LoadingSpinner loadingText="読み込み中..." />;
    }

    if (loadComplete && hotelRooms?.myHotelRooms?.data?.length) {
        content = (
            <Table
                columns={columns}
                data={tableData || []}
                handleRemoveRow={handleRemoveRow}
                refetchPricings={refetch}
            />
        );
    }

    const addNewScheme = useCallback(() => {
        setTableData((prev) => [
            ...prev,
            {
                hotelId,
                name: "",
                roomCharge: "",
                oneAdultCharge: "",
                twoAdultCharge: "",
                threeAdultCharge: "",
                fourAdultCharge: "",
                fiveAdultCharge: "",
                sixAdultCharge: "",
                sevenAdultCharge: "",
                eightAdultCharge: "",
                nineAdultCharge: "",
                tenAdultCharge: "",
                oneChildCharge: "",
                twoChildCharge: "",
                threeChildCharge: "",
                fourChildCharge: "",
                fiveChildCharge: "",
                sixChildCharge: "",
                sevenChildCharge: "",
                eightChildCharge: "",
                nineChildCharge: "",
                tenChildCharge: "",
                isNew: true,
            },
        ]);
    }, []);

    return (
        <div className="px-2 pb-2">
            <div className="py-4 text-gray-700">{content}</div>

            {!hotelRooms?.myHotelRooms?.data?.length &&
                (!loading || !pricingLoading) && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-sm font-semibold text-gray-500">
                            部屋登録されていません。料金プラン登録するため部屋を登録して下さい。
                        </div>
                        <Button
                            variant="primary"
                            className="whitespace-nowrap w-40 text-white bg-indigo-600 hover:bg-indigo-300"
                            onClick={() => {
                                window.location.href = `/host/hotel-space/edit/${hotelId}?tab=2`;
                            }}
                            loading={loading || pricingLoading}
                        >
                            部屋設定へ戻る
                        </Button>
                    </div>
                )}

            {hotelRooms?.myHotelRooms?.data?.length > 0 && (
                <Button
                    variant="primary"
                    className="whitespace-nowrap w-40 text-white bg-indigo-600 hover:bg-indigo-300"
                    onClick={addNewScheme}
                    loading={loading || pricingLoading}
                >
                    料金設定の追加
                </Button>
            )}
        </div>
    );
};

export default Pricing;
