import React from "react";
type TNetworkHelper = "loading" | "error" | "no-data";
interface NetworkHelperProps {
    type: TNetworkHelper;
    message?: string | any;
}
export const NetworkHelper = ({ type, message }: NetworkHelperProps): any => {
    if (!type) {
        console.log("type is required");
        return null;
    }

    switch (type) {
        case "loading":
            return (
                <div className="w-full text-center py-20 text-gray-700">
                    {message || "Loading..."}
                </div>
            );
        case "no-data":
            return (
                <div className="w-full text-center py-20 text-gray-700">
                    {message || "No data available."}
                </div>
            );
        case "error":
            return (
                <div className="w-full text-center py-20 text-red-400">
                    {message || "Error occurred."}
                </div>
            );
        default:
            return null;
    }
};
