import React from "react";

export interface TagProps {
    Icon?: React.ComponentType<{ className: string }>;
    IconStyle?: string;
    numberOfLines?: number;
    children: React.ReactNode;
}

const Tag = ({ Icon, IconStyle, numberOfLines, children }: TagProps) => {
    return (
        <div className="flex space-x-1 items-center">
            {Icon && (
                <Icon
                    className={`flex-none w-4 h-4 text-gray-300 inline-block ${
                        IconStyle && IconStyle
                    }`}
                />
            )}
            <div
                className={`text-gray-500 text-xs ${
                    numberOfLines
                        ? "line-clamp-" + numberOfLines
                        : "whitespace-nowrap"
                }`}
            >
                {children}
            </div>
        </div>
    );
};

Tag.defaultProps = {
    Icon: null,
    IconStyle: "",
    Text: "Tag",
    children: "Tag",
};

export default Tag;
