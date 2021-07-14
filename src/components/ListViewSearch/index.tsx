import { SingleListItem } from '@comp'
import React from 'react'

export const ListViewSearch = ({ lists, activeIndex, setActiveIndex }) => {
    return (
        <div>
            {lists.map(list => (
                <div key={list.id}>
                    <SingleListItem data={list} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                    <div className="w-full my-6 border border-gray-200" />
                </div>
            ))}
        </div>
    )
}
