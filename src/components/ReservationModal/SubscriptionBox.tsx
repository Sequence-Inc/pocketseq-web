import { HOTEL_SUBSCRIPTION_CATEGORIES } from "@config";
import { SwitchField } from "@element";
import React, { useMemo } from "react";
import { PriceFormatter } from "src/utils";
import { LoadingSpinner } from "../LoadingSpinner";
import SubscriptionCard from "./SubscriptionCard";

type SubscriptionBoxProps = {
    fetchingSpace?: boolean;
    spaceDetails?: any;
    hasHotelSubscriptions?: any;
    setSubscription?: Function;
    priceData?: any;
    useSubscription?: boolean;
};

const SubsciptionBox = React.memo(function MemoizedComponent({
    fetchingSpace,
    spaceDetails,
    hasHotelSubscriptions,
    setSubscription,
    priceData,
    useSubscription,
}: SubscriptionBoxProps) {
    if (fetchingSpace) {
        return <LoadingSpinner />;
    }

    if (!spaceDetails?.plan?.subcriptionPrice)
        return (
            <div className="text-sm">
                Subscription not applicable to this hotel room.
            </div>
        );
    if (!hasHotelSubscriptions) {
        return (
            <div className="text-sm">
                お客様は現在、いずれのサブスクリプションプランにも加入していません。
            </div>
        );
    }

    if (hasHotelSubscriptions?.remainingUnit < 1)
        return (
            <>
                <SubscriptionCard
                    useSubscription={useSubscription}
                    priceData={priceData}
                    hasHotelSubscriptions={hasHotelSubscriptions}
                />

                <div className="text-sm">
                    You subscription is already fully utilized.
                </div>
            </>
        );

    if (
        hasHotelSubscriptions?.amount > HOTEL_SUBSCRIPTION_CATEGORIES.B ||
        hasHotelSubscriptions?.amount > spaceDetails?.plan?.subcriptionPrice
    ) {
        return (
            <>
                <SubscriptionCard
                    useSubscription={useSubscription}
                    priceData={priceData}
                    hasHotelSubscriptions={hasHotelSubscriptions}
                />
                <div className="w-full flex items-center  space-x-4">
                    <div className="text-sm font-bold">Use Subscription</div>
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

    if (hasHotelSubscriptions?.amount < spaceDetails?.plan?.subcriptionPrice) {
        return (
            <>
                <SubscriptionCard
                    useSubscription={useSubscription}
                    priceData={priceData}
                    hasHotelSubscriptions={hasHotelSubscriptions}
                />
                <div className="w-full flex items-center  space-x-4">
                    <div className="text-sm font-bold">Use Subscription</div>
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
