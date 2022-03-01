import Head from "next/head";
import withAuth from "src/utils/withAuth";
import HostLayout from "src/layouts/HostLayout";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import { config } from "src/utils";

function AdminDashboard({ userSession }) {
    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Admin - {config.appName}</title>
            </Head>
            <div className="bg-gray-50"></div>
        </HostLayout>
    );
}

export default AdminDashboard;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["admin"],
    });
    if (validation !== true) {
        return validation;
    } else {
        return {
            props: {
                userSession,
            },
        };
    }
};
