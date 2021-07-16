import { SingleListItem } from "@comp";
import React from "react";

export const ListViewSearch = ({ lists, activeIndex, setActiveIndex }) => {
    return (
        <>
            {lists.map((list) => (
                <div className="py-5">
                    <SingleListItem
                        key={list.id}
                        data={list}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                    />
                </div>
            ))}
        </>
    );
};
