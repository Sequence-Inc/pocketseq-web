import React from "react";

export interface TitleProps {
    numberOfLines?: number;
    titleStyle?: string;
    children: React.ReactNode;
}

const Title = ({ numberOfLines, titleStyle, children }: TitleProps) => {
    return (
        <h3
            className={`text-gray-800 line-clamp-${numberOfLines} ${
                titleStyle && titleStyle
            }`}
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
