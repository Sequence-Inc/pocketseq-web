import { useMutation } from "@apollo/client";
import { Container, GoogleMap } from "@element";
import { CurrencyYenIcon } from "@heroicons/react/outline";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import createApolloClient from "src/apollo/apolloClient";
import {
    GET_SPACE_BY_ID,
    PUBLISH_SPACE,
} from "src/apollo/queries/space.queries";
import { durationSuffix } from "src/components/Space/PricingPlan";
import HostLayout from "src/layouts/HostLayout";
import { config, PriceFormatter } from "src/utils";
import requireAuth from "src/utils/authecticatedRoute";

const DayOverride = ({ userSession, currentSpace }) => {
    const {
        id,
        name,
        description,
        address,
        maximumCapacity,
        nearestStations,
        needApproval,
        numberOfSeats,
        photos,
        pricePlans,
        settings,
        spaceTypes,
        spaceSize,
        published,
    } = currentSpace;

    const [isPublished, setIsPublished] = useState(published);
    const [loading, setLoading] = useState(false);

    const [publishSpace] = useMutation(PUBLISH_SPACE);

    const handlePublish = async () => {
        setLoading(true);
        try {
            const { data } = await publishSpace({
                variables: {
                    id,
                },
            });
            alert(data.publishSpace.message);
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>
                    {name} | {config.appName}
                </title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 ">
                <div className="bg-white rounded-lg shadow-lg px-6 py-8">
                    <div className="w-full space-y-3">
                        <div className="flex items-center justify-around w-full border-b border-gray-100 pb-2">
                            <h2 className="flex-grow text-lg text-gray-600 font-bold ">
                                {name}
                            </h2>
                            <div className="space-x-4">
                                <Link href={`/host/my-space/edit/${id}`}>
                                    <a className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
                                        Edit
                                    </a>
                                </Link>
                                <button
                                    disabled={loading}
                                    onClick={() => handlePublish()}
                                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                                        loading &&
                                        "opacity-30 hover:cursor-not-allowed"
                                    }`}
                                >
                                    {published
                                        ? "Unpublish space"
                                        : "Publish space"}
                                </button>
                            </div>
                        </div>
                        <div>
                            {spaceTypes.map((type, index) => {
                                return (
                                    <span
                                        key={index}
                                        className="bg-gray-100 px-3 py-2 text-xs rounded"
                                    >
                                        {type.title}
                                    </span>
                                );
                            })}
                        </div>
                        <div className="border-t border-gray-200 px-2 py-5">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-bold text-gray-500">
                                        スペース名
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        {name}
                                    </dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-bold text-gray-500">
                                        紹介文
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        {description}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-bold text-gray-500">
                                        最大収容人数
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        {maximumCapacity}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-bold text-gray-500">
                                        最大着席人数
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        {numberOfSeats}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-bold text-gray-500">
                                        広さ (m²)
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        {spaceSize}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-bold text-gray-500">
                                        住所
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        〒{address.postalCode}
                                        {address.prefecture.name}
                                        {address.addressLine1}
                                        <br />
                                        {address.addressLine2}
                                    </dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-bold text-gray-500">
                                        地図
                                    </dt>
                                    <dd className="mt-2 h-96 text-base text-gray-700 rounded-lg overflow-hidden shadow">
                                        <GoogleMap
                                            mark={{
                                                lat: address.latitude,
                                                lng: address.longitude,
                                            }}
                                            zoom={16}
                                            type="single"
                                        />
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-bold text-gray-500">
                                        pricePlans
                                    </dt>
                                    <dd className="mt-2 text-base text-gray-700">
                                        <ul
                                            role="list"
                                            className="border border-gray-200 rounded-md divide-y divide-gray-200"
                                        >
                                            {pricePlans.map((plan) => (
                                                <li
                                                    key={plan.id}
                                                    className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                                                >
                                                    <div className="w-0 flex-1 flex items-center">
                                                        <CurrencyYenIcon
                                                            className="flex-shrink-0 h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="ml-2 flex-1 w-0 truncate">
                                                            {plan.title}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0 font-bold">
                                                        {PriceFormatter(
                                                            plan.amount
                                                        )}
                                                        /
                                                        {durationSuffix(
                                                            plan.type
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>
                            </dl>
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
        const { data } = await client.query({
            query: GET_SPACE_BY_ID,
            variables: {
                id: context.query.id,
            },
        });
        return {
            props: {
                userSession,
                currentSpace: data.spaceById,
            },
        };
    }
};
