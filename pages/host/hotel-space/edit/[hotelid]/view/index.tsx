import { useMutation } from "@apollo/client";
import { Container, GoogleMap } from "@element";
import { useModalDialog } from "@hooks/useModalDialog";
import moment from "moment";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import createApolloClient from "src/apollo/apolloClient";
import {
    GET_HOTEL_BY_ID,
    PUBLISH_HOTEL,
} from "src/apollo/queries/hotel.queries";
import AlertModal from "src/components/AlertModal";
import HostLayout from "src/layouts/HostLayout";
import { config } from "src/utils";
import requireAuth from "src/utils/authecticatedRoute";

const DayOverride = ({ userSession, hotel }) => {
    const {
        id,
        name,
        description,
        address,
        checkInTime,
        checkOutTime,
        nearestStations,
        photos,
        rooms,
        packagePlans,
        status,
        createdAt,
        updatedAt,
    } = hotel;

    const [isPublished, setIsPublished] = useState(
        status === "PUBLISHED" ? true : false
    );
    const [loading, setLoading] = useState(false);

    const [publishHotel] = useMutation(PUBLISH_HOTEL, {
        onCompleted(data) {
            setModalData({
                intent: "SUCCESS",
                title: isPublished
                    ? "サイト掲載不しました"
                    : "サイト掲載しました",
                text: data.publishHotel.message,
                onConfirm: () => {
                    setIsPublished(!isPublished);
                },
            });
            openModal();
        },
        onError(error) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            openModal();
        },
    });

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

    const handlePublishUnpublish = async () => {
        setLoading(true);
        setModalData({ ...modalData, intent: "LOADING" });
        openModal();

        try {
            setModalData({
                intent: "CONFIRM",
                title: isPublished
                    ? `${name}を非公開にしてもよろしいですか?`
                    : `${name}を公開してもよろしいですか?`,
                text: "",
                onConfirm: async () => {
                    await publishHotel({
                        variables: {
                            id,
                            publish: !isPublished,
                        },
                    });
                },
            });
            openModal();
        } catch (error) {
            // alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderPublishButton = () => {
        if (isPublished) {
            // show unpublish button
            return (
                <button
                    disabled={loading}
                    onClick={() => handlePublishUnpublish()}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                        loading && "opacity-30 hover:cursor-not-allowed"
                    }`}
                >
                    サイト掲載不可
                </button>
            );
        } else {
            // show publish button
            return (
                <button
                    disabled={loading}
                    onClick={() => handlePublishUnpublish()}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                        loading && "opacity-30 hover:cursor-not-allowed"
                    }`}
                >
                    サイト掲載可
                </button>
            );
        }
    };

    const renderCutOffText = (cutOffDays, cutOffTime) => {
        if (!cutOffTime || !cutOffDays) {
            return "予定無し";
        } else {
            return (
                <>
                    {cutOffDays === 0 ? "当日" : `${cutOffDays}日前`}{" "}
                    {moment(cutOffTime, "hh:mm:ss").format("hh:mm A")}
                </>
            );
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
                        <div className="flex items-center justify-around w-full border-b border-gray-300 pb-2">
                            <h2 className="flex-grow text-lg text-gray-600 font-bold ">
                                {name}
                            </h2>
                            <div className="space-x-4">
                                <Link href={`/host/hotel-space/edit/${id}`}>
                                    <a className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
                                        編集
                                    </a>
                                </Link>
                                {renderPublishButton()}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start space-x-10 w-full">
                        <div className="w-1/2 px-2 py-5">
                            <dl className="space-y-6">
                                <div className="">
                                    <dt className=" text-lg font-bold text-gray-500">
                                        スペース名
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        {name}
                                    </dd>
                                </div>
                                <div className="">
                                    <dt className=" text-lg font-bold text-gray-500">
                                        紹介文
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        {description}
                                    </dd>
                                </div>
                                <div className="">
                                    <dt className=" text-lg font-bold text-gray-500">
                                        チェックイン時間
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        {moment(checkInTime, "hh:mm:ss").format(
                                            "hh:mm A"
                                        )}
                                        <br />
                                    </dd>
                                </div>
                                <div className="">
                                    <dt className=" text-lg font-bold text-gray-500">
                                        チェックアウト時間
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        {moment(
                                            checkOutTime,
                                            "hh:mm:ss"
                                        ).format("hh:mm A")}
                                    </dd>
                                </div>

                                <div className="">
                                    <dt className=" text-lg font-bold text-gray-500">
                                        最寄り駅
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        {nearestStations.map(
                                            ({ station, accessType, time }) => {
                                                return (
                                                    <div key={station.id}>
                                                        {station.stationName}駅
                                                        から
                                                        {accessType}
                                                        {time}分
                                                    </div>
                                                );
                                            }
                                        )}
                                    </dd>
                                </div>

                                <div className="">
                                    <dt className=" text-lg font-bold text-gray-500">
                                        住所
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        〒{address.postalCode}
                                        {address.prefecture.name}
                                        {address.city}
                                        {address.addressLine1}
                                        {address.addressLine2}
                                    </dd>
                                </div>

                                <div className="">
                                    <dt className=" text-lg font-bold text-gray-500">
                                        地図
                                    </dt>
                                    <dd className="mt-2 w-full h-96 text-base text-gray-700 rounded-lg overflow-hidden shadow">
                                        <GoogleMap
                                            mark={{
                                                lat: address.latitude,
                                                lng: address.longitude,
                                            }}
                                            zoom={16}
                                            type="single"
                                            setFreeCoords={() => {}}
                                        />
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <div className="w-1/2 px-2 py-5">
                            <dl className="space-y-6">
                                <div className="">
                                    <dt className=" text-lg font-bold text-gray-500">
                                        寝室
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        <div className="space-y-2">
                                            {rooms.map((room) => {
                                                return (
                                                    <div className="border border-gray-300 shadow-sm rounded py-2 px-3 space-y-1">
                                                        <h3 className="font-bold text-sm">
                                                            {room.name}
                                                        </h3>
                                                        <div>
                                                            最大人数 (大人
                                                            {
                                                                room.maxCapacityAdult
                                                            }
                                                            人・子供
                                                            {room.maxCapacityChild ||
                                                                0}
                                                            人)
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </dd>
                                </div>

                                <div className="">
                                    <dt className=" text-lg font-bold text-gray-500">
                                        プラン
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700">
                                        <div className="space-y-2">
                                            {packagePlans.map((plan) => {
                                                return (
                                                    <div className="border border-gray-300 shadow-sm rounded py-2 px-3 space-y-1">
                                                        <h3 className="font-bold text-sm">
                                                            {plan.name}
                                                        </h3>
                                                        <div className="flex">
                                                            <div className="w-20 font-bold text-gray-500">
                                                                宿泊期間:
                                                            </div>
                                                            <div className="w-80">
                                                                {plan.startUsage
                                                                    ? moment(
                                                                          plan.startUsage
                                                                      ).format(
                                                                          "YYYY年MM月DD日"
                                                                      )
                                                                    : "予定無し"}
                                                                〜
                                                                {plan.endUsage
                                                                    ? moment(
                                                                          plan.endUsage
                                                                      ).format(
                                                                          "YYYY年MM月DD日"
                                                                      )
                                                                    : "予定無し"}
                                                            </div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="w-20 font-bold text-gray-500">
                                                                予約期間:
                                                            </div>
                                                            <div className="w-80">
                                                                {plan.startReservation
                                                                    ? moment(
                                                                          plan.startReservation
                                                                      ).format(
                                                                          "YYYY年MM月DD日"
                                                                      )
                                                                    : "予定無し"}
                                                                〜
                                                                {plan.endReservation
                                                                    ? moment(
                                                                          plan.endReservation
                                                                      ).format(
                                                                          "YYYY年MM月DD日"
                                                                      )
                                                                    : "予定無し"}
                                                            </div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="w-20 font-bold text-gray-500">
                                                                手仕舞い:
                                                            </div>
                                                            <div className="w-80">
                                                                {renderCutOffText(
                                                                    plan.cutOffBeforeDays,
                                                                    plan.cutOffTillTime
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="w-20 font-bold text-gray-500">
                                                                寝室:
                                                            </div>
                                                            <div className="w-80">
                                                                (
                                                                {plan.roomTypes.map(
                                                                    (
                                                                        packageRoom,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <span>
                                                                                {
                                                                                    packageRoom
                                                                                        .hotelRoom
                                                                                        .name
                                                                                }
                                                                                {plan
                                                                                    .roomTypes
                                                                                    .length -
                                                                                    1 >
                                                                                index
                                                                                    ? " / "
                                                                                    : ""}
                                                                            </span>
                                                                        );
                                                                    }
                                                                )}
                                                                )
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </Container>
            <AlertModal
                isOpen={isModalOpen}
                disableTitle={true}
                disableDefaultIcon={true}
                setOpen={() => {
                    closeModal();
                    setModalData(null);
                }}
                disableClose={true}
            >
                <div className="text-sm text-gray-500">{modalContent}</div>
            </AlertModal>
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
            query: GET_HOTEL_BY_ID,
            variables: {
                id: context.query.hotelid,
            },
        });
        return {
            props: {
                userSession,
                hotel: data.hotelById,
            },
        };
    }
};
