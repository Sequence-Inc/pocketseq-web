import React, { useCallback, useEffect, useState, useRef } from "react";
import AddPlanForm from "./AddPlanForm";
import { TAddHotelProps } from "@appTypes/timebookTypes";
import { PlusIcon } from "@heroicons/react/outline";
import PlanList from "./PlanList";
import { Button } from "@element";
import { useQuery, NetworkStatus } from "@apollo/client";

import { Plans as PlanQueries } from "src/apollo/queries/hotel";

const { queries: planQueries } = PlanQueries;
interface IPlanFormProps extends TAddHotelProps {
    hotelId: string;
}

const noOfItems = 10;

const Plans = (props: IPlanFormProps) => {
    const { hotelId } = props;
    const [showForm, setForm] = useState<boolean>(false);
    const defaultFormData = useRef(null);
    const [skip, setSkip] = useState<number>(0);

    const { data, loading, networkStatus, refetch } = useQuery(
        planQueries.PACKAGE_PLAN_BY_HOTEL,
        {
            variables: {
                hotelId,
                paginate: { take: noOfItems, skip: 0 },
            },
            skip: !hotelId,
        }
    );

    const toggleForm = () => setForm((prev) => !prev);

    const closeForm = () => {
        toggleForm();
        defaultFormData.current = null;
    };

    const setFormData = useCallback(
        (data: string) => {
            setForm(true);

            defaultFormData.current = data;
        },
        [defaultFormData]
    );

    const handlePaginate = React.useCallback(
        (type: "next" | "prev") => {
            const hasNext = data?.myPackagePlans?.paginationInfo?.hasNext;
            const hasPrevious =
                data?.myPackagePlans?.paginationInfo?.hasPrevious;

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

    useEffect(() => {
        return () => {
            setForm(false);
        };
    }, []);

    return (
        <div>
            <div className="flex md:justify-end">
                <div className="flex px-6 mt-6 space-x-3 md:mt-0 md:ml-4">
                    {!showForm && (
                        <Button
                            variant="primary"
                            Icon={PlusIcon}
                            onClick={toggleForm}
                        >
                            プランの追加
                        </Button>
                    )}
                </div>
            </div>
            {!showForm && (
                <PlanList
                    data={data?.myPackagePlans?.data}
                    loading={loading}
                    refetching={networkStatus === NetworkStatus.refetch}
                    setFormData={setFormData}
                    handlePaginate={handlePaginate}
                    pagination={data?.myPackagePlans?.paginationInfo}
                />
            )}
            {showForm && (
                <AddPlanForm
                    hotelId={hotelId}
                    setActiveTab={props.setActiveTab}
                    activeTab={props.activeTab}
                    toggleForm={closeForm}
                    selectedPlan={defaultFormData?.current}
                />
            )}
        </div>
    );
};

export default Plans;
