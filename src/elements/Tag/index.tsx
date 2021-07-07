import React from "react";

export interface TagProps {
    Icon?: React.ComponentType<{ className: string }>;
    IconStyle?: string;
    TextStyle?: string;
    numberOfLines?: number;
    children: React.ReactNode;
}

const Tag = ({
    Icon,
    IconStyle,
    TextStyle,
    numberOfLines,
    children,
}: TagProps) => {
    return (
        <div className="flex items-center space-x-1">
            {Icon && (
                <Icon
                    className={`flex-none w-4 h-4 text-gray-300 inline-block ${
                        IconStyle && IconStyle
                    }`}
                />
            )}
            <div
                className={`text-gray-500 ${TextStyle && TextStyle} ${
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
    TextStyle: "",
    Text: "Tag",
    children: "Tag",
    numberOfLines: 1,
};

export default Tag;
