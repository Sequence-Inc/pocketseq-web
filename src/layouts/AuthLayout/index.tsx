import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex justify-center min-h-screen align-middle bg-gray-100">
            <div>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout;
