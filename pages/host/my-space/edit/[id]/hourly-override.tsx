import React, { useState } from "react";
import HostLayout from "src/layouts/HostLayout";
import useAddSpace from "@hooks/useAddSpace";
import ConfirmModal from "src/elements/ConfirmModal";
import { Container } from "@element";
import { useRouter } from "next/router";

import useTranslation from "next-translate/useTranslation";
import DayOfWeek, { DaysOfWeekProps } from "src/components/DayOfWeekOverride";
import HourlyOverride from "src/components/HourlyOverride";

const testData: DaysOfWeekProps = [
    {
        hour: "9",
        dailyData: {
            workHours: { startTime: "09:00", endTime: "18:00" },
            breakHours: { startTime: "13:00", endTime: "14:00" },
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
            workHours: { startTime: "09:00", endTime: "18:00" },
            breakHours: { startTime: "13:00", endTime: "14:00" },
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
            workHours: { startTime: "09:00", endTime: "18:00" },
            breakHours: { startTime: "13:00", endTime: "14:00" },
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
            workHours: { startTime: "09:00", endTime: "18:00" },
            breakHours: { startTime: "13:00", endTime: "14:00" },
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
            workHours: { startTime: "09:00", endTime: "18:00" },
            breakHours: { startTime: "13:00", endTime: "14:00" },
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
            workHours: { startTime: "09:00", endTime: "18:00" },
            breakHours: { startTime: "13:00", endTime: "14:00" },
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
            workHours: { startTime: "09:00", endTime: "18:00" },
            breakHours: { startTime: "13:00", endTime: "14:00" },
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
    const { loading, confirmRef } = useAddSpace();
    const router = useRouter();

    const { t } = useTranslation("adminhost");

    const { id } = router.query;
    return (
        <HostLayout>
            <ConfirmModal ref={confirmRef} redirect="/user-host/my-space" />
            <Container className="py-4 sm:py-6 lg:py-8">
                <HourlyOverride data={testData} />
            </Container>
        </HostLayout>
    );
};

export default DayOfWeekOverride;
