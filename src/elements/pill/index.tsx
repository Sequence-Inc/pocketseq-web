import React from 'react';
import clsx from 'clsx';

interface PillProps {
    variant?: 'default' | 'error';
    className?: string;
}

const Pill = ({ variant, className }: PillProps) => {
    return (
        <div className={clsx(
            'inline-block px-6 py-2.5 rounded-full text-sm font-medium bg-white',
            className && className, {
            'text-gray-600 border border-gray-200': variant === 'default',
            'text-red-600 border border-red-200': variant === 'error'
        }
        )}>
            Pill content
        </div>
    )
}

Pill.defaultProps = {
    variant: 'default'
}

export default Pill;
