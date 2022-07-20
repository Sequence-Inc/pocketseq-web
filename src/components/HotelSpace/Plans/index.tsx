import React, { useEffect, useState } from "react";
import AddPlanForm from "./AddPlanForm";
import { TAddHotelProps } from "@appTypes/timebookTypes";
import { PlusIcon, XIcon } from "@heroicons/react/outline";
import PlanList from "./PlanList";
import { Button, Container } from "@element";
import { useQuery, useLazyQuery, NetworkStatus } from "@apollo/client";
import {
    MY_PACKGAE_PLANS,
    PACKAGE_PLAN_BY_ID,
} from "src/apollo/queries/hotel.queries";

interface IPlanFormProps extends TAddHotelProps {
    hotelId: string;
}
const Plans = (props: IPlanFormProps) => {
    const { hotelId } = props;
    const [showForm, setForm] = useState<boolean>(false);
    const [
        getPackagePlan,
        { loading: fetchingPlan, error: fetchPlanError, data: packagePlanData },
    ] = useLazyQuery(PACKAGE_PLAN_BY_ID, {
        fetchPolicy: "network-only",
    });

    const toggleForm = () => setForm((prev) => !prev);
    const [defaultFormData, setDefaultFormData] = useState(null);

    const setFormData = (data) => {
        setDefaultFormData(data);
        toggleForm();
    };

    const { data, loading, error, networkStatus } = useQuery(MY_PACKGAE_PLANS, {
        variables: {
            hotelId,
        },
        skip: !hotelId,
    });

    useEffect(() => {
        if (defaultFormData?.id) {
            getPackagePlan({
                variables: {
                    id: defaultFormData.id,
                },
            });
        }
    }, [defaultFormData]);

    useEffect(() => {
        return () => setForm(false);
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
                            Add Plan
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
                    {...props}
                    toggleForm={toggleForm}
                    initialValue={packagePlanData?.packagePlanById}
                    packageLoading={fetchingPlan}
                />
            )}
        </div>
    );
};

export default Plans;
