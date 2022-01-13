import { SingleListItem } from "@comp";
import React from "react";
import { ISpace } from "src/types/timebookTypes";

export const ListViewSearch = ({
    lists,
    activeIndex,
    setActiveIndex,
}: {
    lists: ISpace[];
    activeIndex: string | number;
    setActiveIndex: any;
}) => {
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
