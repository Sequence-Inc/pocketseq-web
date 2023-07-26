import React, { useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container, ToastAlert } from "@element";
import { OfficeBuildingIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { Tabs } from "antd";
import { General, Rooms, Pricing, Plans } from "src/components/HotelSpace";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";

import { General as GeneralQuries } from "src/apollo/queries/hotel";

const { query: generalQueries } = GeneralQuries;

const { TabPane } = Tabs;

function EditHotelSpace({ userSession, activeIndex }) {
    const { t } = useTranslation("adminhost");
    const [activeTab, setActiveTab] = useState<number>(activeIndex);
    const [hotelId, setHotelId] = useState<string>();
    const router = useRouter();
    const { hotelid: id } = router.query;

    const {
        data,
        loading: hotelLoading,
        refetch,
    } = useQuery(generalQueries.HOTEL_BY_ID, {
        variables: { id },
        fetchPolicy: "network-only",
    });

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Hotel Space</title>
            </Head>

            <div className="bg-white shadow mb-3 sm:mb-5">
                <Container>
                    <div className="py-8 md:flex md:items-center md:justify-between">
                        {/* Page Header Starts */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                                <div>
                                    <div className="flex items-center">
                                        <OfficeBuildingIcon
                                            className="flex-shrink-0 mr-1.5 h-6 w-6 text-gray-700"
                                            aria-hidden="true"
                                        />
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            {t("add-hotel")}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Page Header Ends */}
                    </div>
                </Container>
            </div>

            <Container className="bg-white py-4 sm:py-6 lg:py-8 mt-3 mb-3 sm:mb-5">
                <Tabs
                    defaultActiveKey="1"
                    tabBarGutter={10}
                    activeKey={activeTab?.toString()}
                    onTabClick={(key) => {
                        window.location.href = `/host/hotel-space/edit/${id}?tab=${key}`;
                    }}
                    type="card"
                >
                    <TabPane tab="基本情報" key="1">
                        <General
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            setHotelId={setHotelId}
                            initialValue={data?.hotelById}
                            hotelLoading={hotelLoading}
                        />
                    </TabPane>
                    <TabPane tab="部屋設定" key="2">
                        <Rooms
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            hotelId={data?.hotelById?.id || id}
                            // initialValue={data?.hotelById?.rooms}
                        />
                    </TabPane>
                    <TabPane tab="料金設定" key="3">
                        <Pricing
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            hotelId={data?.hotelById?.id || id}
                        />
                    </TabPane>
                    <TabPane tab="プラン" key="4">
                        <Plans
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            hotelId={data?.hotelById?.id || id}
                        />
                    </TabPane>
                </Tabs>
            </Container>
        </HostLayout>
    );
}

export default EditHotelSpace;

export const getServerSideProps = async (context) => {
    const { tab } = context.query;
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["host"],
    });
    if (validation !== true) {
        return validation;
    } else {
        return {
            props: {
                userSession,
                activeIndex: tab || 1,
            },
        };
    }
};
