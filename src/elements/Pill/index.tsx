import React from 'react';
import clsx from 'clsx';

interface PillProps {
    variant?: 'default' | 'error';
    className?: string;
    children: React.ReactNode;
    size?: 'small' | 'big';
}

const Pill = ({ variant, className, size, children }: PillProps) => {
    return (
        <div className={clsx(
            'inline-block rounded-full text-sm font-medium bg-white',
            className && className, {
            'text-gray-600 border border-gray-200': variant === 'default',
            'text-red-600 border border-red-200': variant === 'error',
            'px-4 py-1.5': size === 'small',
            'px-6 py-2.5': size === 'big'
        }
        )}>
            {children}
        </div>
    )
}

Pill.defaultProps = {
    variant: 'default',
    size: 'small'
}

export default Pill;
