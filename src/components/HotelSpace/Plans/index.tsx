import React, { useEffect, useState } from "react";
import AddPlanForm from "./AddPlanForm";
import { TAddHotelProps } from "@appTypes/timebookTypes";
import { PlusIcon, XIcon } from "@heroicons/react/outline";
import PlanList from "./PlanList";
import { Button, Container } from "@element";
import { useQuery, NetworkStatus } from "@apollo/client";
import { MY_PACKGAE_PLANS } from "src/apollo/queries/hotel.queries";

interface IPlanFormProps extends TAddHotelProps {
    hotelId: string;
}
const Plans = (props: IPlanFormProps) => {
    const { hotelId } = props;
    const [showForm, setForm] = useState<boolean>(false);

    const toggleForm = () => setForm((prev) => !prev);

    const { data, loading, error, networkStatus } = useQuery(MY_PACKGAE_PLANS, {
        variables: {
            hotelId,
        },
        skip: !hotelId,
    });

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
                />
            )}
            {showForm && <AddPlanForm {...props} toggleForm={toggleForm} />}
        </div>
    );
};

export default Plans;
