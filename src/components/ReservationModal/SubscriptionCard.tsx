import React, { useMemo } from "react";
import { PriceFormatter } from "src/utils";

type TSubscriptionCardProps = {
    useSubscription?: boolean;
    priceData?: any;
    hasHotelSubscriptions?: any;
};

const SubscriptionCard = React.memo(function MemoizedCard(
    props: TSubscriptionCardProps
) {
    const { useSubscription, priceData, hasHotelSubscriptions } = props;
    const progressBar = useMemo(() => {
        if (useSubscription && priceData?.subscriptionUnit) {
            return (
                ((hasHotelSubscriptions.unit -
                    hasHotelSubscriptions.remainingUnit +
                    priceData.subscriptionUnit) /
                    hasHotelSubscriptions.unit) *
                100
            );
        } else {
            return (
                ((hasHotelSubscriptions.unit -
                    hasHotelSubscriptions.remainingUnit) /
                    hasHotelSubscriptions.unit) *
                100
            );
        }
    }, [priceData?.subscriptionUnit, hasHotelSubscriptions, useSubscription]);

    const utilizedUnits = useMemo(() => {
        if (useSubscription && priceData?.subscriptionUnit) {
            return (
                hasHotelSubscriptions.unit -
                hasHotelSubscriptions.remainingUnit +
                priceData.subscriptionUnit
            );
        } else {
            return (
                hasHotelSubscriptions.unit - hasHotelSubscriptions.remainingUnit
            );
        }
    }, [priceData, hasHotelSubscriptions, useSubscription]);

    return (
        <>
            <div className="flex justify-between space-x-2">
                <div className="text-sm font-bold flex-wrap">
                    {hasHotelSubscriptions.type === "hotel"
                        ? "宿泊"
                        : "レンタルスペース"}
                    {" - "}
                    {hasHotelSubscriptions.name}{" "}
                    {hasHotelSubscriptions.priceType}
                </div>
                <div className=" flex-nowrap">
                    <span className="font-bold text-sm flex flex-nowrap">
                        {PriceFormatter(hasHotelSubscriptions.amount)}
                        /月
                    </span>
                </div>
            </div>
            <div className="text-right text-sm text-gray-600">
                {utilizedUnits}/{hasHotelSubscriptions.unit}
                {hasHotelSubscriptions.type === "rental-space" ? "泊" : "時間"}
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
