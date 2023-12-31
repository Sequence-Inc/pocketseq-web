import {
    SpaceInfoBanner,
    SpaceInfoAccess,
    LoadingSpinner,
    HostProfile,
    RecommendationGrid,
} from "@comp";
import { Button, Container, Rating, Spinner, Tag } from "@element";
import React, { useCallback, useEffect, useState } from "react";
import { MainLayout } from "@layout";
import Link from "next/link";
import {
    config,
    FormatShortAddress,
    hoursAsCancelPolicyDuration,
    PriceFormatter,
    publicImage,
} from "src/utils";
import { IRating } from "src/types/timebookTypes";
import Head from "next/head";
import { useRouter } from "next/router";
import createApolloClient from "src/apollo/apolloClient";
import { getSession, signIn } from "next-auth/react";
import { FloatingPriceThree } from "src/components/FloatingPriceThree";
import { GET_HOTEL_BY_ID } from "src/apollo/queries/hotel.queries";
import {
    LocationMarkerIcon,
    CheckIcon,
    ExclamationIcon,
} from "@heroicons/react/outline";
import { GET_PAYMENT_SOURCES } from "src/apollo/queries/user.queries";
import { useLazyQuery } from "@apollo/client";
import RequestReservationModal from "src/components/ReservationModal";
import PaymentMethods from "src/components/PaymentMethods";
import { useReserveHotel } from "@hooks/reserveHotel";
import ProgressModal from "src/components/ProgressModal";

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
            <div className="mb-4 text-sm text-gray-500 whitespace-pre-line">
                {description}
            </div>
            {/* <Link href="/">
                <a className="text-gray-600 underline">もっと見る</a>
            </Link> */}
        </div>
    );
};

const SpaceDetail = ({ hotelId, hotel, userSession }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [reservationData, setReservationData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [selectedAdditionalOptions, setAdditionalOptions] = useState([]);

    const [showProgressModal, setProgressModalVisibility] =
        useState<boolean>(false);

    const router = useRouter();

    const toggleProgressModal = () =>
        setProgressModalVisibility((prev) => !prev);

    const {
        handleHotelReservation,
        reservingHotel,
        reservedHotelSuccessData,
        reserveHotelError,
    } = useReserveHotel();

    const handleAdditionalOptionsChange = useCallback((options) => {
        setAdditionalOptions(
            options
                ?.filter((option) => option?.isChecked)
                ?.map((option) => ({
                    optionId: option.id,
                    quantity: option.quantity,
                }))
        );
    }, []);

    const [
        fetchPaymentMethods,
        {
            data: paymentMethods,
            loading: paymentMethodsLoading,
            error: paymentMethodsError,
        },
    ] = useLazyQuery(GET_PAYMENT_SOURCES, { fetchPolicy: "network-only" });

    useEffect(() => {
        if (userSession) {
            fetchPaymentMethods();
        }
    }, []);

    const handleReservation = useCallback(async () => {
        setProgressModalVisibility(true);
        const input = {
            paymentSourceId: selectedPaymentMethod,
            roomPlanId: reservationData?.roomPlanId,
            checkInDate: reservationData?.startDate?.startOf("day").valueOf(),
            checkOutDate: reservationData?.endDate?.startOf("day").valueOf(),
            nAdult: reservationData?.noOfAdults,
            nChild: reservationData?.noOfChild,
            additionalOptions: selectedAdditionalOptions,
            useSubscription: !!reservationData?.useSubscription,
        };

        await handleHotelReservation(input);
        setShowModal(false);
        setAdditionalOptions([]);
        setReservationData(null);
    }, [selectedPaymentMethod, reservationData, selectedAdditionalOptions]);

    if (paymentMethodsError) {
        return (
            <div>
                <h3>エラーが発生しました: {paymentMethodsError.message}</h3>
                <Link href="/">
                    <Button type="submit">Go Back</Button>
                </Link>
            </div>
        );
    }

    if (paymentMethodsLoading) {
        return (
            <div className="my-20">
                <LoadingSpinner />
            </div>
        );
    }

    const { paymentSource } = paymentMethods || { paymentSource: null };

    const {
        name,
        description,
        address,
        nearestStations,
        photos,
        rooms,
        packagePlans,
        host,
        cancelPolicy,
    } = hotel;

    const location: string = FormatShortAddress(address);

    const rating: IRating = { points: 5, reviews: 1 }; // Todo: implement ratings for each spaces

    const reserve = ({
        startDate,
        endDate,
        noOfAdults,
        noOfChild,
        roomPlanId,
        plan,
        room,
        price,
        noOfNight,
    }) => {
        setReservationData({
            startDate,
            endDate,
            noOfAdults,
            noOfChild,
            roomPlanId,
            plan,
            room,
            price,
            noOfNight,
        });
        setShowModal(true);
    };

    const selectPaymentMethod = (paymentSourceId: string) => {
        if (paymentSourceId) {
            if (paymentSourceId === selectedPaymentMethod) {
                setSelectedPaymentMethod(null);
            } else {
                setSelectedPaymentMethod(paymentSourceId);
            }
        }
    };

    const sendMessage = () => {
        if (host)
            router.push(
                `/messages?name=${host?.name}&recipientIds=${host?.accountId}`
            );
    };

    return (
        <MainLayout userSession={userSession}>
            <Head>
                <title>
                    {name} | {config.appName} ({config.appNameEnglish}) | 「人 ×
                    場所 × 体験」を繋げる 目的に合った場所を検索しよう
                </title>
                <meta
                    name="description"
                    content={`${config.appName} (${config.appNameEnglish})は、会議やParty の場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部
見つかる`}
                />
                <meta
                    name="keywords"
                    content={`${config.appName} (${config.appNameEnglish}), レンタルスペース, ペット可`}
                />
                <meta
                    property="og:title"
                    content={`${name} | ${config.appName} (${config.appNameEnglish}) | 「人 × 場所 × 体験」を繋げる 目的に合った場所を検索しよう`}
                />
                <meta
                    property="og:description"
                    content={`${config.appName} (${config.appNameEnglish})は、会議やParty の場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部見つかる`}
                />
                <meta
                    property="og:image"
                    content={`${publicImage(photos[0], "large")}`}
                />
                <meta
                    name="twitter:title"
                    content={`${name} | ${config.appName} (${config.appNameEnglish}) | 「人 × 場所 × 体験」を繋げる 目的に合った場所を検索しよう`}
                />
                <meta
                    property="twitter:image"
                    content={`${publicImage(photos[0], "large")}`}
                />
            </Head>

            <RequestReservationModal
                showModal={showModal}
                setShowModal={setShowModal}
                reservationData={reservationData}
                setAdditionalOptions={handleAdditionalOptionsChange}
                setReservationData={setReservationData}
                userSession={userSession}
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
                                    className="inline-block font-bold"
                                    disabled={selectedPaymentMethod === null}
                                    onClick={handleReservation}
                                >
                                    支払い＆予約
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="font-bold text-center mb-4">
                                ログインして下さい
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
            </RequestReservationModal>
            <Container className="mt-16">
                <ProgressModal
                    isOpen={showProgressModal}
                    progressing={reservingHotel}
                    title="Hotel room reservation"
                    progressContent={
                        <>
                            <div className="flex items-center justify-center space-x-2">
                                <Spinner message="Reserving Hotel." />
                            </div>
                        </>
                    }
                    succeeded={!!reservedHotelSuccessData}
                    succeededContent={
                        <>
                            <div className="flex items-center justify-center space-x-2">
                                <CheckIcon className="text-green-600 w-10" />
                                <div className="text-xl font-medium text-green-600">
                                    予約完了
                                </div>
                            </div>
                            <div className="mt-4  space-x-2 space-y-2 ">
                                <div className="text-gray-500 text-base text-center">
                                    予約が完了しました。
                                </div>
                                <span className="flex items-center justify-center space-x-2">
                                    <div className="text-gray-600   text-sm text-center">
                                        取引ID:
                                    </div>
                                    {reservedHotelSuccessData?.reserveHotelRoom && (
                                        <div className="text-gray-500  font-bold text-center">
                                            {
                                                reservedHotelSuccessData
                                                    ?.reserveHotelRoom
                                                    ?.reservationId
                                            }
                                        </div>
                                    )}
                                </span>

                                <span className="flex items-center justify-center space-x-2">
                                    <div className="text-gray-600   text-sm text-center">
                                        利用されたサブスクリプション（単位）:
                                    </div>
                                    {reservedHotelSuccessData?.reserveHotelRoom
                                        ?.subscriptionUnit && (
                                        <div className="text-gray-500  font-bold text-center">
                                            {
                                                reservedHotelSuccessData
                                                    ?.reserveHotelRoom
                                                    ?.subscriptionUnit
                                            }
                                            /日
                                        </div>
                                    )}
                                </span>

                                <span className="flex items-center justify-center space-x-2">
                                    <div className="text-gray-600   text-sm text-center">
                                        サブスクリプション価格には含まれない金額
                                    </div>
                                    {reservedHotelSuccessData?.reserveHotelRoom
                                        ?.amount && (
                                        <div className="text-gray-500  font-bold text-center">
                                            {PriceFormatter(
                                                reservedHotelSuccessData
                                                    ?.reserveHotelRoom?.amount
                                            )}
                                        </div>
                                    )}
                                </span>
                            </div>
                        </>
                    }
                    failed={!!reserveHotelError}
                    failedContent={
                        <div className="space-y-4">
                            <div className="flex items-center justify-center space-x-3">
                                <ExclamationIcon className="text-red-600 w-14 border-2 border-red-400 rounded-full p-1" />
                                <div className="text-xl font-medium text-red-600">
                                    エラーが発生しました
                                </div>
                            </div>
                            <div className="mt-2 space-x-2 space-y-2 ">
                                <div className="text-gray-500 text-base ">
                                    予約できませんでした。
                                    後でもう一度試してください。
                                </div>
                            </div>
                        </div>
                    }
                    toggle={toggleProgressModal}
                    actionButtonClassName={
                        !!reservedHotelSuccessData
                            ? "bg-green-300 hover:bg-green-400 disabled:bg-green-200 focus:ring-green-400"
                            : !!reserveHotelError
                            ? "bg-red-300 hover:bg-red-400 disabled:bg-red-200 focus:ring-red-400"
                            : "bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 focus:ring-gray-400"
                    }
                />
                <div className="relative flex space-x-12">
                    <div className="w-full lg:w-2/3">
                        <>
                            <SpaceInfoBanner photos={photos} />
                            <div className="text-lg">
                                <Tag
                                    Icon={LocationMarkerIcon}
                                    iconStyle="text-gray-400"
                                    textStyle="text-lg text-gray-400"
                                    numberOfLines={1}
                                >
                                    {location}
                                </Tag>
                            </div>
                            <h2 className="my-3 text-3xl font-bold text-gray-700">
                                {name}
                            </h2>
                            <div className="flex flex-col space-y-2 md:space-x-3 md:space-y-0 md:items-center md:flex-row">
                                <div className="flex space-x-3 items-center">
                                    <Rating />
                                    <div className="text-sm">
                                        <div className="inline-block font-bold text-lg text-gray-600 mb-0">
                                            {rating.points}
                                        </div>
                                        <span className="text-gray-500 text-lg">
                                            ({rating.reviews}件)
                                        </span>
                                    </div>
                                </div>
                                <div className="text-gray-500 text-lg ml-4">
                                    {rooms.length}寝室
                                </div>
                            </div>
                        </>
                        <div className="w-full my-6 border-t border-gray-300 md:hidden" />
                        <div className="block md:hidden">
                            <FloatingPriceThree
                                plans={packagePlans}
                                currentPlan={selectedPlan}
                                reserve={reserve}
                            />
                        </div>
                        <div className="w-full my-6 border-t border-gray-200" />
                        {/* About Sapce */}
                        <ContentSection
                            title="スペースについて"
                            description={description}
                        />
                        <div className="w-full my-6 border-t border-gray-200" />
                        {/* host profile */}
                        <div className="space-y-6 sm:flex sm:space-y-0 items-center">
                            <div className="flex-1">
                                <HostProfile host={host} />
                            </div>
                            <Button
                                variant="primary"
                                rounded
                                className="w-auto px-4 h-9"
                                onClick={sendMessage}
                            >
                                メッセージをする
                            </Button>
                        </div>
                        {/* divider */}

                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-200" />
                        {/* Package Plans */}
                        <div className="">
                            <h2 className="mb-4 text-lg font-bold text-gray-700">
                                プラン一覧
                            </h2>
                            <div className="flex flex-row space-x-4 w-full overflow-x-auto">
                                {packagePlans.map((plan) => {
                                    // src={room.photos[0].medium.url}
                                    return (
                                        <div
                                            key={plan.id}
                                            className="flex-shrink-0 w-60 rounded-lg"
                                        >
                                            <img
                                                src={plan.photos[0].large.url}
                                                className="w-60 h-40 rounded-lg bg-gray-200"
                                            />
                                            <div className=" space-y-1 py-2 mt-2">
                                                <h3 className="font-bold text-md">
                                                    {plan.name}
                                                </h3>
                                                <div className="pt-2">
                                                    {plan.description}
                                                </div>
                                                <div className="pt-4">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedPlan(
                                                                plan
                                                            )
                                                        }
                                                        className="bg-primary w-full py-2 px-4 text-white font-bold rounded hover:bg-primaryHover"
                                                    >
                                                        予約
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="w-full my-6 border-t border-gray-200" />
                        {/* Rooms */}
                        <div>
                            <h2 className="mb-4 text-lg font-bold text-gray-700">
                                寝室・ベッドについて
                            </h2>
                            <div className="">
                                <div className="overflow-x-scroll w-auto space-x-4 flex flex-row pb-2">
                                    {rooms.map((room) => {
                                        // src={room.photos[0].medium.url}
                                        return (
                                            <div
                                                key={room.id}
                                                className="w-60 rounded-lg flex-shrink-0"
                                            >
                                                <img
                                                    src={
                                                        room.photos[0].large.url
                                                    }
                                                    className="w-60 h-40 rounded-lg bg-gray-200"
                                                />
                                                <div className=" space-y-1 py-2 mt-2">
                                                    <h3 className="font-bold text-md line-clamp-1">
                                                        {room.name}
                                                    </h3>
                                                    <div className="text-gray-600 line-clamp-1">
                                                        {room.description}
                                                    </div>
                                                    <div className="text-gray-800 text-sm font-bold pt-2">
                                                        大人
                                                        {room.maxCapacityAdult}
                                                        {room.maxCapacityChild >
                                                        0
                                                            ? `・子供${room.maxCapacityChild}`
                                                            : ""}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-200" />

                        {/* Services / equipment */}
                        {/* <ContentSection
                            title="サービス・設備"
                            description="ママ会、女子会、おうちデート、映画鑑賞、カップル利用、ファミリー会（子連れ歓迎）、誕生日会、セミナー、ワークショップ、写真撮影、ロケ撮影、商品撮影、商用撮影、ストックフォト、キッチンスタジオ、撮影スタジオ、ハウススタジオ、パーティールーム、レンタルスペース、宿泊可能"
                        />
                        <div className="w-full my-6 border-t border-gray-200" /> */}

                        {/* access section */}
                        <SpaceInfoAccess
                            address={address}
                            nearestStations={nearestStations}
                        />

                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-200" />

                        {/* cancel policy */}
                        {cancelPolicy && (
                            <>
                                <div>
                                    <h2 className="mb-4 text-lg font-bold text-gray-700">
                                        {cancelPolicy.name}
                                    </h2>
                                    <ul>
                                        {cancelPolicy.rates.map(
                                            (policy, index) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        className="text-lg flex justify-between w-full"
                                                    >
                                                        <div>
                                                            {hoursAsCancelPolicyDuration(
                                                                policy.beforeHours
                                                            )}
                                                        </div>
                                                        <div>
                                                            {policy.percentage}%
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                </div>
                                <div className="w-full my-6 border-t border-gray-300" />
                            </>
                        )}

                        {/* reviews and comment section */}
                        {/* <div>
                            <SpaceInfoReviews />
                        </div> */}
                    </div>
                    <div className="hidden md:block">
                        <FloatingPriceThree
                            plans={packagePlans}
                            currentPlan={selectedPlan}
                            reserve={reserve}
                        />
                    </div>
                </div>
                <div>
                    <RecommendationGrid
                        type="HOTEL"
                        logic={{
                            aroundLatLng: `${address.latitude},${address.longitude}`,
                        }}
                        title="近くのスペース"
                        parentId={hotelId}
                    />
                    <RecommendationGrid
                        type="HOTEL"
                        logic={{
                            filters: `buildingType: ${hotel.buildingType}`,
                        }}
                        title="類似した宿泊施設"
                        parentId={hotelId}
                    />
                </div>
            </Container>
        </MainLayout>
    );
};

export default SpaceDetail;

export async function getServerSideProps(context) {
    const { id } = context.query;
    const client = createApolloClient();
    try {
        const { data } = await client.query({
            query: GET_HOTEL_BY_ID,
            variables: { id },
        });
        const userSession = await getSession(context);
        return { props: { hotelId: id, hotel: data.hotelById, userSession } };
    } catch (error) {
        return { props: {} };
    }
}
