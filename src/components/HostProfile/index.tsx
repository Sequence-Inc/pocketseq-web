import { Tag } from "@element";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import React from "react";
export const HostProfile = ({ host }) => {
    let profilePhoto = `https://avatars.dicebear.com/api/identicon/${host.accountId}.svg`;
    if (host.profilePhoto) {
        profilePhoto = host.profilePhoto.medium.url;
    }
    return (
        <div className="flex space-x-4">
            <img
                className="rounded-lg"
                src={profilePhoto}
                width="56"
                height="56"
            />
            <div>
                <div className="mb-1 text-lg font-bold text-gray-700">
                    {host.name}
                </div>
                <div className="flex space-x-3">
                    {/* <Tag
                                    Icon={StarIcon}
                                    iconSize={5}
                                    iconStyle="text-red-500"
                                    textStyle="text-sm text-gray-500"
                                    numberOfLines={1}
                                >
                                    499 評価とレビュー
                                </Tag> */}
                    <Tag
                        Icon={ShieldCheckIcon}
                        iconSize={5}
                        iconStyle="text-gray-400"
                        textStyle="text-sm text-gray-500"
                        numberOfLines={1}
                    >
                        本人確認済み
                    </Tag>
                </div>
            </div>
        </div>
    );
};
