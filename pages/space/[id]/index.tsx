import {
    HostProfile,
    SpaceInfoTitle,
    SpaceInfoBanner,
    SpaceInfoAccess,
    ISpaceInfoTitleProps,
    LoadingSpinner,
} from "@comp";
import { Button, Container, Spinner } from "@element";
import React, { useCallback, useEffect, useState } from "react";
import { MainLayout } from "@layout";
import { ExclamationIcon, CheckIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { GET_SPACE_BY_ID } from "src/apollo/queries/space.queries";
import { GET_PAYMENT_SOURCES } from "src/apollo/queries/user.queries";

import {
    config,
    FormatShortAddress,
    PriceFormatter,
    publicImage,
} from "src/utils";
import { IRating, ISetting, ISpace } from "src/types/timebookTypes";
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
import ProgressModal from "src/components/ProgressModal";
import { RecommendationGrid } from "src/components/RecommendationGrid";
import moment from "moment-timezone";
import {
    decimalHoursToTimeString,
    mapDaysOfWeekFromIndex,
} from "src/utils/dateHelper";

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

const SpaceDetail = ({
    spaceId,
    space,
    userSession,
}: {
    spaceId: string;
    space: ISpace;
    userSession: any;
}) => {
    const id = spaceId;

    const [defaultSettings, setDefaultSettings] = useState<ISetting>();
    const [wantedHours, setWantedHours] = useState<number[]>();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [showProgressModal, setProgressModalVisibility] =
        useState<boolean>(false);

    const [reservationData, setReservationData] =
        useState<TUseCalculateSpacePriceProps>({
            fromDateTime: null,
            duration: null,
            spaceId: spaceId,
            durationType: null,
            useSubscription: false,
        });
    const [selectedAdditionalOptions, setAdditionalOptions] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const toggleProgressModal = () =>
        setProgressModalVisibility((prev) => !prev);

    const [
        fetchPaymentMethods,
        {
            data: paymentMethods,
            loading: paymentMethodsLoading,
            error: paymentMethodsError,
        },
    ] = useLazyQuery(GET_PAYMENT_SOURCES, { fetchPolicy: "network-only" });
    const {
        handleSpaceReservation,
        reservingSpace,
        reservationSuccessData,
        reservationFailure,
    } = useReserveSpace(id);
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
        cancelPolicy,
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
                <h3 className="text-base text-gray-700">{plan.title}</h3>
                <div>
                    {PriceFormatter(plan.amount)}
                    <span className="text-sm text-gray-700">
                        /{plan.duration}
                        {durationSuffix(plan.type)}
                    </span>
                </div>
            </div>
        );
    };

    const handleReserve = useCallback((data: TUseCalculateSpacePriceProps) => {
        setShowModal(true);
        setReservationData(data);
    }, []);

    const handleReservation = useCallback(async () => {
        setProgressModalVisibility(true);
        const input = {
            ...reservationData,
            paymentSourceId: selectedPaymentMethod,
            additionalOptions: selectedAdditionalOptions?.map((option) => ({
                optionId: option?.id,
                quantity: option?.quantity || 1,
            })),

            useSubscription: !!reservationData?.useSubscription,
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

        return () => {
            setProgressModalVisibility(false);
        };
    }, []);

    useEffect(() => {
        if (space?.settings?.length) {
            setDefaultSettings(
                space.settings.find((setting) => !!setting.isDefault)
            );
        }
    }, [space]);

    useEffect(() => {
        if (defaultSettings) {
            const unwantedHours = [
                defaultSettings?.breakFromHr,
                defaultSettings?.breakToHr,
            ].filter((item) => !!item);
            let tempWantedHours = [];

            for (
                let i = Number(defaultSettings?.openingHr || 0);
                i < Number(defaultSettings?.closingHr || 24);
                i++
            ) {
                tempWantedHours.push(i);
            }

            tempWantedHours = tempWantedHours.filter(
                (item) => !unwantedHours.includes(item)
            );
            setWantedHours([...tempWantedHours]);
        }
    }, [defaultSettings]);

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

    const selectPaymentMethod = (paymentSourceId: string) => {
        if (paymentSourceId) {
            if (paymentSourceId === selectedPaymentMethod) {
                setSelectedPaymentMethod(null);
            } else {
                setSelectedPaymentMethod(paymentSourceId);
            }
        }
    };

    const defaultSetting =
        space.settings.filter(({ isDefault }) => isDefault)[0] ?? null;

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

            <Container className="mt-16">
                <ProgressModal
                    isOpen={showProgressModal}
                    progressing={reservingSpace}
                    title="Space reservation"
                    progressContent={
                        <>
                            <div className="flex items-center justify-center space-x-2">
                                <Spinner message="読み込み中" />
                            </div>
                        </>
                    }
                    succeeded={!!reservationSuccessData}
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
                                    {reservationSuccessData?.reserveSpace && (
                                        <div className="text-gray-500  font-bold text-center">
                                            {
                                                reservationSuccessData
                                                    ?.reserveSpace
                                                    ?.reservationId
                                            }
                                        </div>
                                    )}
                                </span>
                            </div>
                            <span className="flex items-center justify-center space-x-2">
                                <div className="text-gray-600   text-sm text-center">
                                    利用されたサブスクリプション（単位）:
                                </div>
                                {reservationSuccessData?.reserveSpace
                                    ?.subscriptionUnit && (
                                    <div className="text-gray-500  font-bold text-center">
                                        {
                                            reservationSuccessData?.reserveSpace
                                                ?.subscriptionUnit
                                        }
                                    </div>
                                )}
                            </span>

                            <span className="flex items-center justify-center space-x-2">
                                <div className="text-gray-600   text-sm text-center">
                                    サブスクリプション価格には含まれない金額
                                </div>
                                {reservationSuccessData?.reserveSpace
                                    ?.amount && (
                                    <div className="text-gray-500  font-bold text-center">
                                        {PriceFormatter(
                                            reservationSuccessData?.reserveSpace
                                                ?.amount
                                        )}
                                    </div>
                                )}
                            </span>
                        </>
                    }
                    failed={!!reservationFailure}
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
                                    {reservationFailure?.message ||
                                        `予約できませんでした。 後でもう一度試してください。`}
                                </div>
                            </div>
                        </div>
                    }
                    toggle={toggleProgressModal}
                    actionButtonClassName={
                        !!reservationSuccessData
                            ? "bg-green-300 hover:bg-green-400 disabled:bg-green-200 focus:ring-green-400"
                            : !!reservationFailure
                            ? "bg-red-300 hover:bg-red-400 disabled:bg-red-200 focus:ring-red-400"
                            : "bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 focus:ring-gray-400"
                    }
                />

                <ReserceSpaceModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    reservationData={reservationData}
                    setAdditionalOptions={setAdditionalOptions}
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
                                        disabled={
                                            selectedPaymentMethod === null
                                        }
                                        onClick={handleReservation}
                                    >
                                        支払い＆予約
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="max-w-md mx-auto">
                                    <div className="font-bold text-center mb-4">
                                        ログイン又はアカウント登録して下さい
                                    </div>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        className="inline-block mb-3"
                                        onClick={() => {
                                            signIn("credentials", {
                                                callbackUrl: `/space/${space.id}`,
                                            });
                                        }}
                                    >
                                        ログイン
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="inline-block"
                                        onClick={() => {
                                            router.push("/auth/register");
                                        }}
                                    >
                                        アカウント登録
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </ReserceSpaceModal>

                <div className="relative flex space-x-12">
                    <div className="w-full lg:flex-1">
                        <div className="h-6"></div>
                        <SpaceInfoTitle titleInfo={titleInfo} />
                        <SpaceInfoBanner photos={photos} />

                        <div className="w-full my-6 border-t border-gray-300 md:hidden" />
                        <div className="block lg:hidden">
                            <FloatingPriceTwo
                                pricePlans={pricePlans}
                                space={space}
                                handleReserve={handleReserve}
                                cancelPolicy={cancelPolicy}
                            />
                        </div>
                        {/* <div className="w-full my-6 border-t border-gray-300" />
                        <SpaceUtilities /> */}

                        {/* divider */}
                        {/* <div className="w-full my-6 border-t border-gray-300" /> */}

                        {/* About Sapce */}
                        <ContentSection
                            title="スペースについて"
                            description={description}
                        />
                        {defaultSetting && (
                            <>
                                <div className="w-full my-6 border-t border-gray-300" />
                                {/* Settings */}
                                <div className="space-y-2 text-gray-700">
                                    <div className="flex">
                                        <div className="w-20 mr-4">営業日:</div>
                                        <div>
                                            {defaultSetting.businessDays
                                                .map((day) =>
                                                    mapDaysOfWeekFromIndex(day)
                                                )
                                                .join("・")}
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-20 mr-4">
                                            営業時間:
                                        </div>
                                        <div>
                                            {decimalHoursToTimeString(
                                                defaultSetting.openingHr
                                            )}
                                            〜
                                            {decimalHoursToTimeString(
                                                defaultSetting.closingHr
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="w-20 mr-4">
                                            休憩時間:
                                        </div>
                                        <div>
                                            {defaultSetting.breakFromHr &&
                                            defaultSetting.breakToHr ? (
                                                <>
                                                    {decimalHoursToTimeString(
                                                        defaultSetting.breakFromHr
                                                    )}
                                                    〜
                                                    {decimalHoursToTimeString(
                                                        defaultSetting.breakToHr
                                                    )}
                                                </>
                                            ) : (
                                                "無し"
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
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
                        <div className="w-full my-6 border-t border-gray-200" />

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
                        {/* <SpaceInfoReviews /> */}
                    </div>
                    <div className="hidden lg:block lg:w-96">
                        <FloatingPriceTwo
                            pricePlans={pricePlans}
                            space={space}
                            handleReserve={handleReserve}
                            cancelPolicy={cancelPolicy}
                        />
                    </div>
                </div>
                <div>
                    <RecommendationGrid
                        type="SPACE"
                        logic={{
                            aroundLatLng: `${address.latitude},${address.longitude}`,
                        }}
                        title="近くのスペース"
                        parentId={spaceId}
                    />
                    <RecommendationGrid
                        type="SPACE"
                        logic={{
                            filters: `spaceTypes: ${space.spaceTypes[0].title}`,
                        }}
                        title="類似した施設"
                        parentId={spaceId}
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
    const { data } = await client.query({
        query: GET_SPACE_BY_ID,
        variables: { id },
    });
    const userSession = await getSession(context);
    return { props: { spaceId: id, space: data.spaceById, userSession } };
}
