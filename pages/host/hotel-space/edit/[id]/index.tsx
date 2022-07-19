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
import { HOTEL_BY_ID } from "src/apollo/queries/hotel.queries";

const { TabPane } = Tabs;

function EditHotelSpace({ userSession }) {
    const { t } = useTranslation("adminhost");
    const [activeTab, setActiveTab] = useState<number>(1);
    const [hotelId, setHotelId] = useState<string>();
    const router = useRouter();
    const { id } = router.query;
    console.log({ id });

    const {
        data,
        loading: hotelLoading,
        refetch,
    } = useQuery(HOTEL_BY_ID, {
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
                    tabBarGutter={40}
                    activeKey={activeTab?.toString()}
                    onTabClick={(key) => setActiveTab(parseInt(key, 10))}
                >
                    <TabPane tab="General" key="1">
                        <General
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            setHotelId={setHotelId}
                            initialValue={data?.hotelById}
                            hotelLoading={hotelLoading}
                        />
                    </TabPane>
                    <TabPane tab="Rooms" key="2">
                        <Rooms
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            hotelId={data?.hotelById?.id || hotelId}
                            // initialValue={data?.hotelById?.rooms}
                        />
                    </TabPane>
                    <TabPane tab="Pricing" key="3">
                        <Pricing
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            hotelId={data?.hotelById?.id || hotelId}
                        />
                    </TabPane>
                    <TabPane tab="Plans" key="4">
                        <Plans
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            hotelId={data?.hotelById?.id || hotelId}
                        />
                    </TabPane>
                </Tabs>
            </Container>
        </HostLayout>
    );
}

export default EditHotelSpace;

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
        return {
            props: {
                userSession,
            },
        };
    }
};
