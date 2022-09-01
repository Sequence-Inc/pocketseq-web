import { SPACE_SUBSCRIPTION_CATEGORIES } from "@config";
import { SwitchField } from "@element";
import React, { useMemo } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import SubscriptionCard from "./SubscriptionCard";

type SubscriptionBoxProps = {
    fetchingSpace?: boolean;
    spaceDetails?: any;
    hasSpaceSubscriptions?: any;
    setSubscription?: Function;
    priceData?: any;
    useSubscription?: boolean;
};

const SubsciptionBox = React.memo(function MemoizedComponent({
    fetchingSpace,
    spaceDetails,
    hasSpaceSubscriptions,
    setSubscription,
    priceData,
    useSubscription,
}: SubscriptionBoxProps) {
    if (fetchingSpace) {
        return <LoadingSpinner />;
    }

    if (!spaceDetails?.subcriptionPrice)
        return (
            <p className="text-sm">
                Subscription not applicable to this space.
            </p>
        );
    if (!hasSpaceSubscriptions) {
        return (
            <p className="text-sm">
                You currently are not subscribed to any subscription plan.
            </p>
        );
    }

    if (hasSpaceSubscriptions?.remainingUnit < 1)
        return (
            <>
                <SubscriptionCard
                    useSubscription={useSubscription}
                    priceData={priceData}
                    hasSpaceSubscriptions={hasSpaceSubscriptions}
                />
                <p className="text-sm">
                    You subscription is already fully utilized.
                </p>
            </>
        );

    if (
        hasSpaceSubscriptions?.amount > SPACE_SUBSCRIPTION_CATEGORIES.B ||
        hasSpaceSubscriptions?.amount > spaceDetails?.subcriptionPrice
    ) {
        return (
            <>
                <SubscriptionCard
                    useSubscription={useSubscription}
                    priceData={priceData}
                    hasSpaceSubscriptions={hasSpaceSubscriptions}
                />

                <div className="w-full flex items-center  space-x-4">
                    <p className="text-sm">Use Subscription</p>
                    <SwitchField
                        className="my-2"
                        onChange={(val) => setSubscription(val)}
                    />
                </div>

                <p className=" text-sm font-semibold">
                    Your subscription can be applied.
                </p>
            </>
        );
    }

    if (hasSpaceSubscriptions?.amount < spaceDetails?.subcriptionPrice) {
        return (
            <>
                <SubscriptionCard
                    useSubscription={useSubscription}
                    priceData={priceData}
                    hasSpaceSubscriptions={hasSpaceSubscriptions}
                />

                <div className="w-full flex items-center  space-x-4">
                    <p className="text-sm">Use Subscription</p>
                    <SwitchField
                        className="my-2"
                        disabled
                        onChange={(val) => setSubscription(val)}
                    />
                </div>
                <p className=" text-sm font-semibold">
                    Your subscription does not cover for this space.
                </p>
            </>
        );
    }
});

export default SubsciptionBox;
