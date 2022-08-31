import { SPACE_SUBSCRIPTION_CATEGORIES } from "@config";
import { SwitchField } from "@element";
import React from "react";
import { LoadingSpinner } from "../LoadingSpinner";

type SubscriptionBoxProps = {
    fetchingSpace?: boolean;
    spaceDetails?: any;
    hasSpaceSubscriptions?: any;
    setSubscription?: Function;
};

const SubsciptionBox = React.memo(function MemoizedComponent({
    fetchingSpace,
    spaceDetails,
    hasSpaceSubscriptions,
    setSubscription,
}: SubscriptionBoxProps) {
    if (fetchingSpace) {
        return <LoadingSpinner />;
    }

    if (!spaceDetails?.subcriptionPrice)
        return (
            <div className="border border-gray-300 shadow-sm px-3 py-3 rounded-lg space-y-5 mt-4">
                <p className="text-sm">
                    Subscription not applicable to this space.
                </p>
            </div>
        );
    if (!hasSpaceSubscriptions) {
        return (
            <div className="border border-gray-300 shadow-sm px-3 py-3 rounded-lg space-y-5 mt-4">
                <p className="text-sm">
                    You currently are not subscribed to any subscription plan.
                </p>
            </div>
        );
    }

    if (hasSpaceSubscriptions?.remainingUnit < 1)
        return (
            <div className="border border-gray-300 shadow-sm px-3 py-3 rounded-lg space-y-5 mt-4">
                <p className="text-sm">
                    You subscription is already fully utilized.
                </p>

                <div>
                    <div className="text-right text-gray-600">
                        {hasSpaceSubscriptions.unit -
                            hasSpaceSubscriptions.remainingUnit}
                        /{hasSpaceSubscriptions.unit}
                        {hasSpaceSubscriptions.type === "rental-space"
                            ? "泊"
                            : "時間"}
                    </div>
                    <div className="relative w-full h-3 bg-gray-100 rounded overflow-hidden">
                        <div
                            className={`h-3 bg-primary`}
                            style={{
                                width: `${
                                    ((hasSpaceSubscriptions.unit -
                                        hasSpaceSubscriptions.remainingUnit) /
                                        hasSpaceSubscriptions.unit) *
                                    100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        );

    if (
        hasSpaceSubscriptions?.amount > SPACE_SUBSCRIPTION_CATEGORIES.B ||
        hasSpaceSubscriptions?.amount > spaceDetails?.subcriptionPrice
    ) {
        return (
            <div className="border border-gray-300 shadow-sm px-3 py-3 rounded-lg space-y-3 mt-4">
                <div>
                    <div className="text-right text-sm text-gray-600">
                        {hasSpaceSubscriptions.unit -
                            hasSpaceSubscriptions.remainingUnit}
                        /{hasSpaceSubscriptions.unit}
                        {hasSpaceSubscriptions.type === "rental-space"
                            ? "泊"
                            : "時間"}
                    </div>
                    <div className="relative w-full h-3 bg-gray-100 rounded overflow-hidden">
                        <div
                            className={`h-3 bg-primary`}
                            style={{
                                width: `${
                                    ((hasSpaceSubscriptions.unit -
                                        hasSpaceSubscriptions.remainingUnit) /
                                        hasSpaceSubscriptions.unit) *
                                    100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>

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
            </div>
        );
    }

    if (hasSpaceSubscriptions?.amount < spaceDetails?.subcriptionPrice) {
        return (
            <div className="border border-gray-300 shadow-sm px-3 py-3 rounded-lg space-y-3 mt-4">
                <div>
                    <div className="text-right text-sm text-gray-600">
                        {hasSpaceSubscriptions.unit -
                            hasSpaceSubscriptions.remainingUnit}
                        /{hasSpaceSubscriptions.unit}
                        {hasSpaceSubscriptions.type === "rental-space"
                            ? "泊"
                            : "時間"}
                    </div>
                    <div className="relative w-full h-3 bg-gray-100 rounded overflow-hidden">
                        <div
                            className={`h-3 bg-primary`}
                            style={{
                                width: `${
                                    ((hasSpaceSubscriptions.unit -
                                        hasSpaceSubscriptions.remainingUnit) /
                                        hasSpaceSubscriptions.unit) *
                                    100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>

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
            </div>
        );
    }
});

export default SubsciptionBox;
