import { useQuery } from "@apollo/client";
import { LoadingSpinner } from "@comp";
import { Container, HostCalendarView } from "@element";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import createApolloClient from "src/apollo/apolloClient";
import { GET_SPACE_BY_ID } from "src/apollo/queries/space.queries";
import HostDayOfWeekView from "src/elements/HostDayOfWeekView";
import HostLayout from "src/layouts/HostLayout";
import { config } from "src/utils";
import requireAuth from "src/utils/authecticatedRoute";

const DayOverride = ({ userSession, space }) => {
    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Edit space | {config.appName}</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 ">
                <div className="flex items-center justify-between py-8">
                    <div className="text-right space-x-8">
                        <Link
                            href={`/host/my-space/edit/${space.id}/override/day-of-week`}
                        >
                            <a className="font-bold text-gray-500 hover:text-primaryHover">
                                Weekly
                            </a>
                        </Link>
                        <Link
                            href={`/host/my-space/edit/${space.id}/override/daily`}
                        >
                            <a className="font-bold text-gray-500 hover:text-primaryHover">
                                Daily
                            </a>
                        </Link>
                        <Link
                            href={`/host/my-space/edit/${space.id}/override/day`}
                        >
                            <a className="font-bold text-gray-500 hover:text-primaryHover">
                                Hourly
                            </a>
                        </Link>
                    </div>
                    <Link href={`/host/my-space/edit/${space.id}/view`}>
                        <a className="font-bold text-gray-500 hover:text-primaryHover">
                            戻る
                        </a>
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow-lg px-6 py-8 pt-4">
                    <div className="w-full space-y-3">
                        <h2 className="text-lg text-gray-600 font-bold border-b border-gray-100 pb-4">
                            Override daily
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

export default DayOverride;

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
