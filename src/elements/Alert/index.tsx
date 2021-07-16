import { ExclamationIcon } from '@heroicons/react/solid'
import React from 'react'

interface AlertProps {
    Icon: React.ComponentType<{ className: string }>;
    children: React.ReactNode
}

const Alert = ({ Icon, children }: AlertProps) => {
    return (
        <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex">
                <div className="flex-shrink-0">
                    <Icon className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3 text-gray-600">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Alert
