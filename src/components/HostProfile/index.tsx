import React from 'react'
import Image from 'next/image'

export const HostProfile = ({ title, description }) => {
    return (
        <div className="flex space-x-4">
            <Image
                className="rounded-lg"
                src="/host.svg"
                width="56"
                height="56"
            />
            <div>
                <p className="mb-1 text-lg text-gray-700">{title}</p>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </div>
    )
}
