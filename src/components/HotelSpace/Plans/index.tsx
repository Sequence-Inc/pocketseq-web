import React, { useCallback, useEffect, useState, useRef } from "react";
import AddPlanForm from "./AddPlanForm";
import { TAddHotelProps } from "@appTypes/timebookTypes";
import { PlusIcon, XIcon } from "@heroicons/react/outline";
import PlanList from "./PlanList";
import { Button, Container } from "@element";
import { useQuery, useLazyQuery, NetworkStatus } from "@apollo/client";

import { Plans as PlanQueries } from "src/apollo/queries/hotel";

const { queries: planQueries } = PlanQueries;
interface IPlanFormProps extends TAddHotelProps {
    hotelId: string;
}
const Plans = (props: IPlanFormProps) => {
    const { hotelId } = props;
    const [showForm, setForm] = useState<boolean>(false);
    const defaultFormData = useRef(null);

    const { data, loading, error, networkStatus } = useQuery(
        planQueries.PACKAGE_PLAN_BY_HOTEL,
        {
            variables: {
                hotelId,
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
                    data={data?.myPackagePlans}
                    loading={loading}
                    refetching={networkStatus === NetworkStatus.refetch}
                    setFormData={setFormData}
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
