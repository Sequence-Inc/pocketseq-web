import { Container } from '@element'
import { Footer, Header } from '@layout'
import React from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default MainLayout
