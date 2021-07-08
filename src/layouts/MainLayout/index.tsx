import { Container } from '@element'
import { Footer, Header } from '@layout'
import React from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <Container className="mt-16">
                {children}
            </Container>
            <Footer />
        </>
    )
}

export default MainLayout
