import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LoadingSpinner } from "@comp";
import { Container, HotelCalendarView } from "@element";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import {
    ADD_PLAN_PRICE_OVERRIDE,
    REMOVE_PLAN_PRICE_OVERRIDE,
    PLAN_AND_PLAN_OVERRIDE,
} from "src/apollo/queries/hotel.queries";
import HostLayout from "src/layouts/HostLayout";
import { config } from "src/utils";
import requireAuth from "src/utils/authecticatedRoute";

const DailyOverride = ({ userSession, packagePlanId, roomPlanId, hotelId }) => {
    const { data, loading, error } = useQuery(PLAN_AND_PLAN_OVERRIDE, {
        variables: {
            roomPlanId,
            packagePlanId,
            hotelId,
        },
        nextFetchPolicy: "network-only",
    });

    const [addPlanPriceOverride] = useMutation(ADD_PLAN_PRICE_OVERRIDE, {
        onCompleted(data) {
            alert("Price override successfully added.");
            location.reload();
            return false;
        },
        onError(error) {
            alert("Error: " + error.message);
        },
    });
    const [removePlanPriceOverride] = useMutation(REMOVE_PLAN_PRICE_OVERRIDE, {
        onCompleted(data) {
            alert("Price override successfully added.");
            location.reload();
            return false;
        },
        onError(error) {
            alert("Error: " + error.message);
        },
    });

    if (loading) {
        return <LoadingSpinner />;
    }
    if (error) {
        return "Error: " + error?.message;
    }

    const addPriceOverride = (overrideData) => {
        try {
            addPlanPriceOverride({
                variables: {
                    roomPlanId,
                    priceOverride: overrideData,
                },
            });
        } catch (error) {
            console.log(error);
        }
    };

    const deletePriceOverride = (overrideId) => {
        if (
            confirm(
                "Are you sure you want to delete this override setting?"
            ) === true
        ) {
            try {
                removePlanPriceOverride({
                    variables: {
                        roomPlanId,
                        priceOverrideIds: [overrideId],
                    },
                });
                alert("Override removed successfully.");
            } catch (error) {
                console.log(error);
                alert("Error: " + error.message);
            }
        }
    };

    const plan = data?.packagePlanById;
    const priceOverride = data?.priceOverridesByRoomPlanId;
    const stockOverride = data?.stockOverridesByPackagePlanId;
    const priceScheme = data?.myPriceSchemes;

    const basicPriceSetting = plan.roomTypes.map((_) => {
        if (_.id === roomPlanId) {
            return _.priceSettings;
        }
    })[0];

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>
                    Plan Price Override | {plan.name} | {config.appName}
                </title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 ">
                <div className="bg-white rounded-lg shadow-lg px-6 py-8 pt-4">
                    <div className="w-full space-y-3">
                        <h2 className="text-lg text-gray-600 font-bold border-b border-gray-100 pb-4">
                            Price Override {plan.name}
                        </h2>

                        <HotelCalendarView
                            type="plan"
                            priceScheme={priceScheme}
                            basicPriceSetting={basicPriceSetting}
                            priceOverride={priceOverride}
                            addPriceOverride={addPriceOverride}
                            deletePriceOverride={deletePriceOverride}
                            hotelId={hotelId}
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
                roomPlanId: context.query.roomplanid,
                hotelId: context.query.hotelid,
                packagePlanId: context.query.planid,
            },
        };
    }
};
