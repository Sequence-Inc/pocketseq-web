import React from 'react';

interface ReviewItemProps {
    id: string;
    title: string;
    value: number;
    className?: string;
}

export const ReviewItem = ({ id, title, value, className }: ReviewItemProps) => {
    const valueInPercent = `${Math.ceil(value * 100 / 5)}%`;

    return (
        <div className={`grid grid-cols-5 ${className || ''}`}>
            <div className="col-span-3 text-gray-800">{title}</div>
            <div className="flex items-center col-span-2 space-x-2">
                <div id={id} className="relative w-20">
                    <div className="flex h-1 overflow-hidden text-xs bg-gray-100 rounded">
                        <div style={{ width: valueInPercent }} className="flex flex-col justify-center text-center text-white bg-gray-400 shadow-none whitespace-nowrap"></div>
                    </div>
                </div>
                <label htmlFor={id} className="text-xs font-bold text-gray-800">{value}</label>
            </div>
        </div>
    )
}