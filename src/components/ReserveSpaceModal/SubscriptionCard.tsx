import React, { useMemo } from "react";
import { PriceFormatter } from "src/utils";

type TSubscriptionCardProps = {
    useSubscription?: boolean;
    priceData?: any;
    hasSpaceSubscriptions?: any;
};

const SubscriptionCard = React.memo(function MemoizedCard(
    props: TSubscriptionCardProps
) {
    const { useSubscription, priceData, hasSpaceSubscriptions } = props;
    const progressBar = useMemo(() => {
        if (useSubscription && priceData?.subscriptionUnit) {
            return (
                ((hasSpaceSubscriptions.unit -
                    hasSpaceSubscriptions.remainingUnit +
                    priceData.subscriptionUnit) /
                    hasSpaceSubscriptions.unit) *
                100
            );
        } else {
            return (
                ((hasSpaceSubscriptions.unit -
                    hasSpaceSubscriptions.remainingUnit) /
                    hasSpaceSubscriptions.unit) *
                100
            );
        }
    }, [priceData?.subscriptionUnit, hasSpaceSubscriptions, useSubscription]);

    const utilizedUnits = useMemo(() => {
        if (useSubscription && priceData?.subscriptionUnit) {
            return (
                hasSpaceSubscriptions.unit -
                priceData.subscriptionUnit +
                hasSpaceSubscriptions.remainingUnit
            );
        } else {
            return (
                hasSpaceSubscriptions.unit - hasSpaceSubscriptions.remainingUnit
            );
        }
    }, [priceData, hasSpaceSubscriptions, useSubscription]);

    return (
        <>
            <div className="flex justify-between space-x-2">
                <div className="text-sm font-bold flex-wrap">
                    {hasSpaceSubscriptions.type === "hotel"
                        ? "宿泊"
                        : "レンタルスペース"}
                    {" - "}
                    {hasSpaceSubscriptions.name}{" "}
                    {hasSpaceSubscriptions.priceType}
                </div>
                <div className=" flex-nowrap">
                    <span className="font-bold text-sm flex flex-nowrap">
                        {PriceFormatter(hasSpaceSubscriptions.amount)}
                        /月
                    </span>
                </div>
            </div>
            <div className="text-right text-sm text-gray-600">
                {utilizedUnits}/{hasSpaceSubscriptions.unit}
                {hasSpaceSubscriptions.type === "rental-space" ? "泊" : "時間"}
            </div>
            <div className="relative w-full h-3 bg-gray-100 rounded overflow-hidden">
                <div
                    className={`h-3 bg-primary`}
                    style={{
                        width: `${progressBar}%`,
                    }}
                ></div>
            </div>
        </>
    );
});

export default SubscriptionCard;
