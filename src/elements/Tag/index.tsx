import React from "react";

export interface TagProps {
    Icon?: React.ComponentType<{ className: string }>;
    iconSize?: number;
    iconStyle?: string;
    textStyle?: string;
    numberOfLines?: number;
    children: React.ReactNode;
}

const Tag = ({
    Icon,
    iconSize,
    iconStyle,
    textStyle,
    numberOfLines,
    children,
}: TagProps) => {
    return (
        <div className="flex items-center space-x-1">
            {Icon && (
                <Icon
                    className={`flex-none w-${iconSize} h-${iconSize} inline-block ${
                        iconStyle || ""
                    }`}
                />
            )}
            <div
                className={`text-gray-500 text-sm ${textStyle || ""} ${
                    numberOfLines
                        ? "line-clamp-" + numberOfLines.toString()
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
    iconSize: 4,
    iconStyle: "",
    textStyle: "",
    text: "Tag",
    children: "Tag",
};

export default Tag;
