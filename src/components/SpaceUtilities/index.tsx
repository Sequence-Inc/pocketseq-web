import React from 'react'

export const SpaceUtilities = ({ Icon, title, description }) => {
    return (
        <div className="flex space-x-4">
            <Icon className="w-6 h-6 mt-0.5 text-gray-700" />
            <div className="text-gray-600">
                <h4 className="font-bold mb-1.5">{title}</h4>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    )
}
