import React from "react";
type TNetworkHelper = "loading" | "error" | "no-data";
interface NetworkHelperProps {
    type: TNetworkHelper;
    message?: string | any;
}
export const NetworkHelper = ({ type, message }: NetworkHelperProps): any => {
    if (!type) {
        return null;
    }

    switch (type) {
        case "loading":
            return (
                <div className="w-full text-center py-20 text-gray-700">
                    {message || "読み込み中..."}
                </div>
            );
        case "no-data":
            return (
                <div className="w-full text-center py-20 text-gray-700">
                    {message || "データがありません。"}
                </div>
            );
        case "error":
            return (
                <div className="w-full text-center py-20 text-red-400">
                    {message || "エラーが発生しました。"}
                </div>
            );
        default:
            return null;
    }
};
