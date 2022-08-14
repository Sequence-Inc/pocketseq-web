import {
    HostProfile,
    SpaceUtilities,
    SpaceInfoTitle,
    SpaceInfoBanner,
    SpaceInfoAccess,
    SpaceInfoReviews,
    ISpaceInfoTitleProps,
    LoadingSpinner,
} from "@comp";
import { Button, Container, Tag } from "@element";
import React, { useCallback, useEffect, useState } from "react";
import { MainLayout } from "@layout";
import {
    StarIcon,
    ShieldCheckIcon,
    CurrencyYenIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import { GET_SPACE_BY_ID } from "src/apollo/queries/space.queries";
import { GET_PAYMENT_SOURCES } from "src/apollo/queries/user.queries";

import {
    config,
    FormatShortAddress,
    PriceFormatter,
    publicImage,
} from "src/utils";
import { IRating } from "src/types/timebookTypes";
import Head from "next/head";
import { useRouter } from "next/router";
import PaymentMethods from "src/components/PaymentMethods";

import createApolloClient from "src/apollo/apolloClient";
import { getSession, signIn } from "next-auth/react";
import { FloatingPriceTwo } from "src/components/FloatingPriceTwo";
import { durationSuffix } from "src/components/Space/PricingPlan";
import ReserceSpaceModal from "src/components/ReserveSpaceModal";
import {
    TUseCalculateSpacePriceProps,
    useReserveSpace,
} from "@hooks/reserveSpace";
import { useLazyQuery } from "@apollo/client";
import AlertModal from "src/components/AlertModal";

const ContentSection = ({
    title,
    description,
}: {
    title: string;
    description: string;
}) => {
    return (
        <div>
            <h2 className="mb-4 text-lg font-bold text-gray-700">{title}</h2>
            <div className="mb-4 text-sm text-gray-500">{description}</div>
            <Link href="/">
                <a className="text-gray-600 underline">もっと見る</a>
            </Link>
        </div>
    );
};

const SpaceDetail = ({ spaceId, space, userSession }) => {
    const id = spaceId;
    const router = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [reservationData, setReservationData] =
        useState<TUseCalculateSpacePriceProps>({
            fromDateTime: null,
            duration: null,
            spaceId: spaceId,
            durationType: null,
        });
    const [selectedAdditionalOptions, setAdditionalOptions] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const [
        fetchPaymentMethods,
        {
            data: paymentMethods,
            loading: paymentMethodsLoading,
            error: paymentMethodsError,
        },
    ] = useLazyQuery(GET_PAYMENT_SOURCES, { fetchPolicy: "network-only" });
    const { handleSpaceReservation, reservingSpace } = useReserveSpace(id);

    const {
        name,
        description,
        maximumCapacity,
        spaceSize,
        spaceTypes,
        pricePlans,
        nearestStations,
        address,
        photos,
        host,
    } = space;

    const location: string = FormatShortAddress(address);

    const rating: IRating = { points: 5, reviews: 1 }; // Todo: implement ratings for each spaces

    const titleInfo: ISpaceInfoTitleProps = {
        name,
        maximumCapacity,
        spaceSize,
        spaceTypes,
        location,
        rating,
    };

    const sendMessage = () => {
        if (host)
            router.push(
                `/messages?name=${host?.name}&recipientIds=${host?.accountId}`
            );
    };

    const pricePlansDaily = [];
    const pricePlansHourly = [];
    const pricePlansMinutes = [];

    pricePlans.map((plan) => {
        if (plan.type === "DAILY") {
            pricePlansDaily.push(plan);
        } else if (plan.type === "HOURLY") {
            pricePlansHourly.push(plan);
        } else if (plan.type === "MINUTES") {
            pricePlansMinutes.push(plan);
        }
    });

    pricePlansDaily.sort((a, b) => a.duration - b.duration);
    pricePlansHourly.sort((a, b) => a.duration - b.duration);
    pricePlansMinutes.sort((a, b) => a.duration - b.duration);

    const renderPricePlanItem = (plan, index) => {
        return (
            <div
                key={`${plan.type}-${index}`}
                className="flex justify-between px-5 py-4 my-4 text-xl text-gray-800 border border-gray-100 bg-gray-50 rounded-xl"
            >
                <h3>{plan.title}</h3>
                <p>
                    {PriceFormatter(plan.amount)}
                    <span className="text-base text-gray-700">
                        /{plan.duration}
                        {durationSuffix(plan.type)}
                    </span>
                </p>
            </div>
        );
    };

    const handleReserve = useCallback((data: TUseCalculateSpacePriceProps) => {
        setShowModal(true);
        setReservationData(data);
    }, []);

    const handleReservation = useCallback(async () => {
        const input = {
            ...reservationData,
            paymentSourceId: selectedPaymentMethod,
            additionalOptions: selectedAdditionalOptions?.map((option) => ({
                optionId: option?.id,
                quantity: option?.quantity || 1,
            })),
        };
        await handleSpaceReservation(input);
        setShowModal(false);
        setAdditionalOptions([]);
        setReservationData(null);
    }, [selectedPaymentMethod, reservationData]);

    useEffect(() => {
        if (userSession) {
            fetchPaymentMethods();
        }
    }, []);

    if (paymentMethodsError) {
        return (
            <div>
                <h3>An error occurred: {paymentMethodsError.message}</h3>
                <Link href="/">
                    <Button type="submit">Go Back</Button>
                </Link>
            </div>
        );
    }

    if (paymentMethodsLoading) {
        return (
            <div>
                <LoadingSpinner />
            </div>
        );
    }

    const { paymentSource } = paymentMethods || { paymentSource: null };

    const selectPaymentMethod = (paymentSourceId: string) => {
        if (paymentSourceId) {
            if (paymentSourceId === selectedPaymentMethod) {
                setSelectedPaymentMethod(null);
            } else {
                setSelectedPaymentMethod(paymentSourceId);
            }
        }
    };

    return (
        <MainLayout userSession={userSession}>
            <Head>
                <title>
                    {name} | 「人 × 場所 × 体験」を繋げる
                    目的に合った場所を検索しよう
                </title>
                <meta
                    name="description"
                    content={`${config.appName} タイムブックは、会議やParty の場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部
見つかる`}
                />
                <meta
                    name="keywords"
                    content={`${config.appName}, タイムブック, レンタルスペース, ペット可`}
                />
                <meta
                    property="og:title"
                    content={`${name} | 「人 × 場所 × 体験」を繋げる 目的に合った場所を検索しよう`}
                />
                <meta
                    property="og:description"
                    content={`${config.appName} タイムブックは、会議やParty の場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部見つかる`}
                />
                <meta
                    property="og:image"
                    content={`${publicImage(photos[0], "large")}`}
                />
                <meta
                    name="twitter:title"
                    content={`${name} | 「人 × 場所 × 体験」を繋げる 目的に合った場所を検索しよう`}
                />
                <meta
                    property="twitter:image"
                    content={`${publicImage(photos[0], "large")}`}
                />
            </Head>

            <Container className="mt-16">
                <AlertModal
                    isOpen={reservingSpace}
                    title="Reserving Hotel"
                    Icon={CurrencyYenIcon}
                    iconClass="h-6 w-6 text-green-600"
                >
                    <div className="flex items-center justify-center h-20">
                        <svg
                            className="animate-spin -ml-1 mr-3 h-6 w-6 text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-50"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span className="text-gray-400 text-lg">
                            Please Wait
                        </span>
                    </div>
                </AlertModal>
                <ReserceSpaceModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    reservationData={reservationData}
                    setAdditionalOptions={setAdditionalOptions}
                >
                    <div className="space-y-6">
                        {userSession ? (
                            <div>
                                <PaymentMethods
                                    paymentSource={paymentSource}
                                    selectPaymentMethod={selectPaymentMethod}
                                    currentPaymentMethod={selectedPaymentMethod}
                                />
                                <div className="mt-4">
                                    <Button
                                        type="button"
                                        variant={
                                            selectedPaymentMethod === null
                                                ? "disabled"
                                                : "primary"
                                        }
                                        className="inline-block"
                                        disabled={
                                            selectedPaymentMethod === null
                                        }
                                        onClick={handleReservation}
                                    >
                                        Pay and Reserve
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="font-bold text-center mb-4">
                                    Please login to finish reservation
                                </div>
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="inline-block"
                                    onClick={() => signIn("credentials")}
                                >
                                    ログイン
                                </Button>
                            </div>
                        )}
                    </div>
                </ReserceSpaceModal>

                <div className="relative flex space-x-12">
                    <div className="lg:flex-1">
                        <div className="h-6"></div>
                        <SpaceInfoTitle titleInfo={titleInfo} />
                        <SpaceInfoBanner photos={photos} />

                        <div className="w-full my-6 border-t border-gray-300 md:hidden" />
                        <div className="block md:hidden">
                            <FloatingPriceTwo
                                pricePlans={pricePlans}
                                space={space}
                                handleReserve={handleReserve}
                            />
                        </div>
                        <div className="w-full my-6 border-t border-gray-300" />
                        <SpaceUtilities />
                        <div className="w-full my-6 border-t border-gray-300" />
                        {/* host profile */}
                        <div>
                            <div className="space-y-6 sm:flex sm:space-y-0">
                                <div className="flex-1">
                                    <HostProfile
                                        title={host?.name}
                                        description="2015年8月年からメンバー"
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    rounded
                                    className="w-auto px-4 h-9"
                                    onClick={sendMessage}
                                >
                                    Send Message
                                </Button>
                            </div>
                            <div className="flex mt-6 space-x-3">
                                <Tag
                                    Icon={StarIcon}
                                    iconSize={5}
                                    iconStyle="text-red-500"
                                    textStyle="text-sm text-gray-500"
                                    numberOfLines={1}
                                >
                                    499 評価とレビュー
                                </Tag>
                                <Tag
                                    Icon={ShieldCheckIcon}
                                    iconSize={5}
                                    iconStyle="text-red-500"
                                    textStyle="text-sm text-gray-500"
                                    numberOfLines={1}
                                >
                                    本人確認済み
                                </Tag>
                            </div>
                        </div>
                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-300" />

                        {/* About Sapce */}
                        <ContentSection
                            title="スペースについて"
                            description={description}
                        />

                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-300" />

                        {/* Services / equipment */}
                        {/* <ContentSection
                            title="サービス・設備"
                            description="ママ会、女子会、おうちデート、映画鑑賞、カップル利用、ファミリー会（子連れ歓迎）、誕生日会、セミナー、ワークショップ、写真撮影、ロケ撮影、商品撮影、商用撮影、ストックフォト、キッチンスタジオ、撮影スタジオ、ハウススタジオ、パーティールーム、レンタルスペース、宿泊可能"
                        /> */}
                        {/* <div className="w-full my-6 border-t border-gray-300" /> */}

                        {/* access section */}
                        <SpaceInfoAccess
                            address={address}
                            nearestStations={nearestStations}
                        />

                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-300" />
                        {/* Price Plans */}
                        <div>
                            <h2 className="mb-4 text-lg font-bold text-gray-700">
                                料金プラン
                            </h2>
                            {pricePlansDaily.map((plan, index) =>
                                renderPricePlanItem(plan, index)
                            )}
                            {pricePlansHourly.map((plan, index) =>
                                renderPricePlanItem(plan, index)
                            )}
                            {pricePlansMinutes.map((plan, index) =>
                                renderPricePlanItem(plan, index)
                            )}
                        </div>
                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-300" />

                        {/* reviews and comment section */}
                        <SpaceInfoReviews />
                    </div>
                    <div className="hidden md:block">
                        <FloatingPriceTwo
                            pricePlans={pricePlans}
                            space={space}
                            handleReserve={handleReserve}
                        />
                    </div>
                </div>
            </Container>
        </MainLayout>
    );
};

export default SpaceDetail;

export async function getServerSideProps(context) {
    const { id } = context.query;
    const client = createApolloClient();
    const { data } = await client.query({
        query: GET_SPACE_BY_ID,
        variables: { id },
    });
    const userSession = await getSession(context);
    return { props: { spaceId: id, space: data.spaceById, userSession } };
}
