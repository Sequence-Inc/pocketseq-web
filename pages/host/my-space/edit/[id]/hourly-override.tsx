import React, { useState } from "react";
import HostLayout from "src/layouts/HostLayout";
import useAddSpace from "@hooks/useAddSpace";
import ConfirmModal from "src/elements/ConfirmModal";
import { Container } from "@element";
import { useRouter } from "next/router";

import useTranslation from "next-translate/useTranslation";
import HourlyOverride, { Day, HoursProps } from "src/components/HourlyOverride";
import Head from "next/head";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";

const testData: HoursProps = [
    {
        hour: 9,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 10,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 11,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 12,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 13,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 14,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 15,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 16,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 17,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
    {
        hour: 18,
        dailyData: {
            stock: 5,
            prices: [
                { pricingCategory: "1時間", price: 1000 },
                { pricingCategory: "5分", price: 120 },
                { pricingCategory: "10分", price: 230 },
                { pricingCategory: "15分", price: 300 },
                { pricingCategory: "30分", price: 550 },
                { pricingCategory: "45分", price: 800 },
            ],
        },
    },
];

const testDay: Day = {
    workHours: { startTime: 9, endTime: 18 },
    breakHours: { startTime: 13, endTime: 14 },
};

const DayOfWeekOverride = ({ userSession }) => {
    const { loading, confirmRef } = useAddSpace();
    const router = useRouter();

    const { t } = useTranslation("adminhost");

    const { id } = router.query;

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Hourly override</title>
            </Head>
            <ConfirmModal ref={confirmRef} redirect="/user-host/my-space" />
            <Container className="py-4 sm:py-6 lg:py-8">
                <h2 className="text-2xl mb-4 text-primary font-semibold">
                    Hourly override
                </h2>
                <HourlyOverride day={testDay} data={testData} />
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
        return {
            props: {
                userSession,
            },
        };
    }
};
