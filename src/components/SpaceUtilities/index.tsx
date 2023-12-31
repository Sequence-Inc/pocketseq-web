import {
    CheckIcon,
    LightningBoltIcon,
    LockOpenIcon,
    SparklesIcon,
} from "@heroicons/react/outline";
import React from "react";

interface SingleSpaceUtilityProps {
    Icon?: React.ComponentType<{ className: string }>;
    title: string;
    description: string;
}

const SingleSpaceUtility = ({
    Icon,
    title,
    description,
}: SingleSpaceUtilityProps) => {
    return (
        <div className="flex space-x-4">
            <div className="w-6">
                <Icon className="w-6 h-6 text-gray-700" />
            </div>
            <div className="text-gray-600">
                <h4 className="font-bold mb-2">{title}</h4>
                <div className="text-sm">{description}</div>
            </div>
        </div>
    );
};

export const SpaceUtilities = () => {
    return (
        <div className="space-y-4">
            <SingleSpaceUtility
                Icon={LightningBoltIcon}
                title="トップホストのスペースです"
                description="トップホストとは、スペースマーケットの設定する条件をクリアした優良ホストに対して送られる称号です。"
            />
            <SingleSpaceUtility
                Icon={SparklesIcon}
                title="優れた清潔感"
                description="最近このスペースを利用したゲストの100％が清潔だったと言っています。"
            />
            <SingleSpaceUtility
                Icon={LockOpenIcon}
                title="スムーズな入退室"
                description="最近このスペースを利用したゲストの100％が、入退室がスムーズだったと言っています。"
            />
            <SingleSpaceUtility
                Icon={CheckIcon}
                title="感染症対策の実施"
                description="このスペースは利用された後、スタッフが毎回必ず清掃と除菌を行なっています。"
            />
        </div>
    );
};
