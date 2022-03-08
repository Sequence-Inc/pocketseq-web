import { useQuery } from "@apollo/client";
import { LoadingSpinner } from "@comp";
import { Container, HostCalendarView } from "@element";
import { getSession } from "next-auth/react";
import Head from "next/head";
import createApolloClient from "src/apollo/apolloClient";
import { GET_SPACE_BY_ID } from "src/apollo/queries/space.queries";
import HostDayOfWeekView from "src/elements/HostDayOfWeekView";
import HostLayout from "src/layouts/HostLayout";
import { config } from "src/utils";
import requireAuth from "src/utils/authecticatedRoute";

const DayOfWeekOverride = ({ userSession, space }) => {
    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Edit space | {config.appName}</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 ">
                <div className="bg-white rounded-lg shadow-lg px-6 py-8">
                    <div className="w-full space-y-3">
                        <h2 className="text-lg text-gray-600 font-bold border-b border-gray-100 pb-2">
                            Override
                        </h2>
                        <div>
                            <HostDayOfWeekView
                                plans={space.pricePlans}
                                settings={space.settings}
                                spaceId={space.id}
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </HostLayout>
    );
};

export default DayOfWeekOverride;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["host"],
    });
    if (validation !== true) {
        return validation;
    } else {
        const client = createApolloClient();
        const space = await client.query({
            query: GET_SPACE_BY_ID,
            variables: {
                id: context.query.id,
            },
        });
        return {
            props: {
                userSession,
                space: space.data?.spaceById,
            },
        };
    }
};
