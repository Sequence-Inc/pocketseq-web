import { StarIcon } from "@heroicons/react/solid";
import React from "react";

const Rating = () => {
    return (
        <div className="flex">
            {Array(5)
                .fill(0)
                .map((r, index) => (
                    <StarIcon
                        key={`rate-${index}`}
                        className="w-5 h-5 text-yellow-400"
                    />
                ))}
        </div>
    );
};

export default Rating;
