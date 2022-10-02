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
                <p className="mb-1 text-lg text-gray-700">{host.name}</p>
                <p className="text-sm text-gray-400">{host.createdAt}</p>
            </div>
        </div>
    );
};
