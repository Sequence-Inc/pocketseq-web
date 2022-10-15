import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LoadingSpinner } from "@comp";
import { Container, HotelCalendarViewStock } from "@element";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import {
    ADD_PLAN_STOCK_OVERRIDE,
    REMOVE_PLAN_STOCK_OVERRIDE,
    PLAN_AND_PLAN_STOCK_OVERRIDE,
} from "src/apollo/queries/hotel.queries";
import HostLayout from "src/layouts/HostLayout";
import { config } from "src/utils";
import requireAuth from "src/utils/authecticatedRoute";

const DailyOverride = ({ userSession, planId, hotelId }) => {
    const { data, loading, error } = useQuery(PLAN_AND_PLAN_STOCK_OVERRIDE, {
        variables: {
            packagePlanId: planId,
            hotelId,
        },
        nextFetchPolicy: "network-only",
    });

    const [addRoomStockOverride] = useMutation(ADD_PLAN_STOCK_OVERRIDE, {
        onCompleted(data) {
            alert("Stock override successfully added.");
            location.reload();
            return false;
        },
    });
    const [removeRoomStockOverride] = useMutation(REMOVE_PLAN_STOCK_OVERRIDE, {
        onCompleted(data) {
            alert("Stock override successfully deleted.");
            location.reload();
            return false;
        },
    });

    if (loading) {
        return <LoadingSpinner />;
    }
    if (error) {
        return "Error: " + error?.message;
    }

    const addStockOverride = (overrideData) => {
        try {
            addRoomStockOverride({
                variables: {
                    packagePlanId: planId,
                    stockOverride: overrideData,
                },
            });
            // alert("Override added successfully.");
            // location.reload();
            return false;
        } catch (error) {
            console.log(error);
            alert("Error: " + error.message);
        }
    };

    const deleteStockOverride = (overrideId) => {
        if (
            confirm(
                "Are you sure you want to delete this override setting?"
            ) === true
        ) {
            try {
                removeRoomStockOverride({
                    variables: {
                        packagePlanId: planId,
                        stockOverrideIds: [overrideId],
                    },
                });
            } catch (error) {
                console.log(error);
                alert("Error: " + error.message);
            }
        }
    };

    const plan = data?.packagePlanById;
    const stockOverride = data?.stockOverridesByPackagePlanId;

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>
                    Plan Stock Override | {plan.name} | {config.appName}
                </title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 ">
                <div className="bg-white rounded-lg shadow-lg px-6 py-8 pt-4">
                    <div className="w-full space-y-3">
                        <h2 className="text-lg text-gray-600 font-bold border-b border-gray-100 pb-4">
                            Stock Override {plan.name}
                        </h2>

                        <HotelCalendarViewStock
                            defaultStock={plan.stock}
                            stockOverride={stockOverride}
                            addStockOverride={addStockOverride}
                            deleteStockOverride={deleteStockOverride}
                        />
                    </div>
                </div>
            </Container>
        </HostLayout>
    );
};

export default DailyOverride;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["host"],
    });
    if (validation !== true) {
        return validation;
    } else {
        return {
            props: {
                userSession,
                planId: context.query.planid,
                hotelId: context.query.hotelid,
            },
        };
    }
};
