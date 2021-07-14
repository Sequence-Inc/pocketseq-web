import React from 'react'
import { ItemGrid } from '../ItemGrid'

export const GridViewSearch = ({ lists, activeIndex, setActiveIndex }) => {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {lists.map(list => (
                <ItemGrid key={list.id} data={list} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            ))}
        </div>
    )
}
