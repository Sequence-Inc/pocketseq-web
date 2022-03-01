import { Footer, Header } from "@layout";
import { Session } from "next-auth";

const MainLayout = ({
    userSession,
    children,
}: {
    userSession: Session;
    children: React.ReactNode;
}) => {
    return (
        <>
            <Header userSession={userSession} />
            {children}
            <Footer />
        </>
    );
};

export default MainLayout;
