import clsx from "clsx";
import React from "react";

export interface TitleProps {
    numberOfLines?: 1 | 2 | 3;
    titleStyle?: string;
    children: React.ReactNode;
}

const Title = ({ numberOfLines, titleStyle, children }: TitleProps) => {
    return (
        <h3
            className={clsx(`text-gray-800 line-clamp-${numberOfLines}`, {
                'line-clamp-1': numberOfLines === 1,
                'line-clamp-2': numberOfLines === 2,
                'line-clamp-3': numberOfLines === 3,
                titleStyle: titleStyle
            })}
        >
            {children}
        </h3>
    );
};

Title.defaultProps = {
    numberOfLines: 1,
    titleStyle: "",
    children: "Title",
};

export default Title;
