import { useQuery } from "@apollo/client";
import { LoadingSpinner } from "@comp";
import { Container, HostCalendarView } from "@element";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import createApolloClient from "src/apollo/apolloClient";
import { GET_SPACE_BY_ID } from "src/apollo/queries/space.queries";
import HostLayout from "src/layouts/HostLayout";
import { config } from "src/utils";
import requireAuth from "src/utils/authecticatedRoute";

const DailyOverride = ({ userSession, spaceId }) => {
    const { data, loading, error } = useQuery(GET_SPACE_BY_ID, {
        variables: {
            id: spaceId,
        },
        nextFetchPolicy: "network-only",
    });

    if (loading) {
        return (
            <div className="my-20">
                <LoadingSpinner />
            </div>
        );
    }
    if (error) {
        return "Error: " + error.message;
    }

    const space = data?.spaceById;

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
                                週
                            </a>
                        </Link>
                        <Link
                            href={`/host/my-space/edit/${space.id}/override/daily`}
                        >
                            <a className="font-bold text-gray-500 hover:text-primaryHover">
                                日
                            </a>
                        </Link>
                        <Link
                            href={`/host/my-space/edit/${space.id}/override/day`}
                        >
                            <a className="font-bold text-gray-500 hover:text-primaryHover">
                                時間
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
                            日: 上書き
                        </h2>
                        <div>
                            <HostCalendarView
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

export default DailyOverride;

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
        // const client = createApolloClient();
        // const space = await client.query({
        //     query: GET_SPACE_BY_ID,
        //     variables: {
        //         id: context.query.id,
        //     },
        //     fetchPolicy: "network-only",
        // });
        return {
            props: {
                userSession,
                spaceId: context.query.id,
            },
        };
    }
};
