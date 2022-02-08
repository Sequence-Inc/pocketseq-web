import React, { useState } from "react";
import HostLayout from "src/layouts/HostLayout";
import { Container } from "@element";
import { useRouter } from "next/router";

import useTranslation from "next-translate/useTranslation";
import DaysOfWeekOverride, {
    DaysOfWeekProps,
} from "src/components/DayOfWeekOverride";
import Head from "next/head";

const testData: DaysOfWeekProps = [
    {
        day: "日",
        dailyData: {
            workHours: { startTime: 9.25, endTime: 18 },
            breakHours: { startTime: 13.5, endTime: 14.5 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
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
        day: "月",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
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
        day: "火",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
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
        day: "水",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
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
        day: "木",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
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
        day: "金",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
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
        day: "土",
        dailyData: {
            workHours: { startTime: 9, endTime: 18 },
            breakHours: { startTime: 13, endTime: 14 },
            stock: 5,
            prices: [
                { pricingCategory: "1日", price: 5000 },
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

const DayOfWeekOverride = () => {
    const router = useRouter();

    const { t } = useTranslation("adminhost");

    const { id } = router.query;

    return (
        <HostLayout>
            <Head>
                <title>Day of week override</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8">
                <DaysOfWeekOverride data={testData} />
            </Container>
        </HostLayout>
    );
};

export default DayOfWeekOverride;
