import { SingleListItem } from '@comp'
import React from 'react'

export const ListViewSearch = ({ lists }) => {
    return (
        <div>
            {lists.map(list => (
                <>
                    <SingleListItem data={list} />
                    <div className="w-full my-6 border border-gray-200" />
                </>
            ))}
        </div>
    )
}
