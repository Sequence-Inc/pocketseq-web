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
        return (
            <div className="my-20">
                <LoadingSpinner />
            </div>
        );
    }

    if (!spaceDetails?.plan?.subcriptionPrice)
        return (
            <div className="text-sm">
                この施設にはサブスクリプション適用されません。
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
                    サブスクリプションは完全に活用されています。
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
                    <div className="text-sm font-bold">
                        サブスクリプションを利用しますか？
                    </div>
                    <SwitchField
                        className="my-2"
                        onChange={(val) => setSubscription(val)}
                    />
                </div>
                <div className=" text-sm font-semibold">
                    サブスクリプションを適用できます。
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
                    <div className="text-sm font-bold">
                        {" "}
                        サブスクリプションを利用しますか？
                    </div>
                    <SwitchField
                        className="my-2"
                        disabled
                        onChange={(val) => setSubscription(val)}
                    />
                </div>
                <div className=" text-sm font-semibold">
                    ご利用されたサブスクリプションプランはこの施設に適用できません。
                </div>
            </>
        );
    }
});

export default SubsciptionBox;
