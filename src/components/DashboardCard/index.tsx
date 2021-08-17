import React from 'react'

const DashboardCard = ({ Icon, name, amount, url }) => {
    return (
        <>
            <div className="overflow-hidden bg-white rounded-lg shadow">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Icon className="w-6 h-6 text-gray-400" aria-hidden="true" />
                        </div>
                        <div className="flex-1 w-0 ml-5">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">{name}</dt>
                                <dd>
                                    <div className="text-lg font-medium text-gray-900">{amount}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-3 bg-gray-50">
                    <div className="text-sm">
                        <a href={url} className="font-medium text-cyan-700 hover:text-cyan-900">
                            View all
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardCard
