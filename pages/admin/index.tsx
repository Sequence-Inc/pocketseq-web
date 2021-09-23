import Head from "next/head";
import withAuth from "src/utils/withAuth";
import HostLayout from "src/layouts/HostLayout";

function AdminDashboard() {
    return (
        <HostLayout>
            <Head>
                <title>Admin - Timebook</title>
            </Head>
            <div className="bg-gray-50"></div>
        </HostLayout>
    );
}

export default withAuth(AdminDashboard);
