import React from 'react';

interface PillProps {
    variant?: 'default' | 'error';
    className?: string;
}

const Pill = ({ variant, className }: PillProps) => {
    return (
        <div className={`inline-block px-6 py-2.5 rounded-full text-sm font-medium bg-white ${variant === 'default' ? 'text-gray-600 border border-gray-200' : variant === 'error' ? 'text-red-600 border border-red-200' : ''} ${className}`}>
            Pill content
        </div>
    )
}

Pill.defaultProps = {
    variant: 'default'
}

export default Pill;
