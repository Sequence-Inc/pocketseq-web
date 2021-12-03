import { Footer, Header } from '@layout';
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen align-middle bg-gray-100">
                <div>
                    {children}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AuthLayout;
