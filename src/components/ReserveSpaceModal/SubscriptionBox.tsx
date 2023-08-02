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
        return (
            <div className="my-20">
                <LoadingSpinner />
            </div>
        );
    }

    if (!spaceDetails?.subcriptionPrice)
        return (
            <div className="text-sm">
                Subscription not applicable to this space.
            </div>
        );
    if (!hasSpaceSubscriptions) {
        return (
            <div className="text-sm">
                お客様は現在、いずれのサブスクリプションプランにも加入していません。
            </div>
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
                <div className="text-sm">
                    You subscription is already fully utilized.
                </div>
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
                    <div className="text-sm">Use Subscription</div>
                    <SwitchField
                        className="my-2"
                        onChange={(val) => setSubscription(val)}
                    />
                </div>

                <div className=" text-sm font-semibold">
                    Your subscription can be applied.
                </div>
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
                    <div className="text-sm">Use Subscription</div>
                    <SwitchField
                        className="my-2"
                        disabled
                        onChange={(val) => setSubscription(val)}
                    />
                </div>
                <div className=" text-sm font-semibold">
                    Your subscription does not cover for this space.
                </div>
            </>
        );
    }
});

export default SubsciptionBox;
