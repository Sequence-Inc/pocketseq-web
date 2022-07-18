import React, { useState, useEffect, useCallback } from "react";
import { TAddHotelProps } from "@appTypes/timebookTypes";
import {
    ROOMS_BY_HOTEL_ID,
    PRICING_BY_HOTEL_ID,
} from "src/apollo/queries/hotel.queries";
import { useQuery } from "@apollo/client";
import useTranslation from "next-translate/useTranslation";
import { Button } from "@element";
import { TTableKey, THotelPriceScheme } from "@appTypes/timebookTypes";
import { PRICE_SCHEME_ADULTS, PRICE_SCHEME_CHILD } from "@config";
import Table from "./component/Table";
import { LoadingSpinner } from "src/components/LoadingSpinner";

interface IPricingFormProps extends TAddHotelProps {
    hotelId: string;
}

const Pricing = ({ hotelId, activeTab, setActiveTab }: IPricingFormProps) => {
    const { t } = useTranslation("adminhost");
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const toggleForm = () => setFormVisible((prev) => !prev);
    const [hasNew, setHasNew] = useState(false);
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

    const [tableData, setTableData] = useState<THotelPriceScheme[]>();

    const handleNext = () => {
        setActiveTab(activeTab + 1);
    };

    const handleSubmit = () => {
        toggleForm();
        refetch();
    };

    const [columns, setColumns] = useState<TTableKey[] | undefined>();
    const [loadComplete, setLoadComplete] = useState<boolean>(false);

    const handleCreateTable = useCallback(() => {
        if (!hotelRooms?.myHotelRooms?.length) {
            return;
        }

        const maxAdultCapacity = Math.max(
            ...hotelRooms?.myHotelRooms?.map(
                (room) => room?.maxCapacityAdult || 0
            )
        );

        const maxChildCapacity = Math.max(
            ...hotelRooms?.myHotelRooms?.map(
                (room) => room?.maxCapacityChild || 0
            )
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

        setColumns(keys);
        setTableData(pricingDatas?.myPriceSchemes || []);
        setLoadComplete(true);

        return () => {};
    }, [hotelRooms?.myHotelRooms, pricingDatas?.myPriceSchemes]);

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
                data={tableData || []}
                handleRemoveRow={handleRemoveRow}
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

            <Button
                variant="primary"
                className="whitespace-nowrap w-40 text-white bg-indigo-600 hover:bg-indigo-300"
                onClick={addNewScheme}
                loading={loading || pricingLoading}
            >
                Add Price Scheme
            </Button>
        </div>
    );
};

export default Pricing;
