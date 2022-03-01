import React, { useState } from "react";
import HostLayout from "src/layouts/HostLayout";
import { Container, Select } from "@element";
import { useRouter } from "next/router";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import {
    BusinessDaysManager,
    BusinessHourManager,
    HolidayManager,
    PricingPlanManager,
    StockManager,
} from "./days-of-week";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";

const DayOfWeekOverride = ({ userSession }) => {
    const router = useRouter();

    const { t } = useTranslation("adminhost");

    const { id } = router.query;

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>基本設定</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8">
                <h2 className="text-2xl mb-4 text-primary font-semibold">
                    基本設定
                </h2>
                <div className="space-y-5">
                    <BusinessDaysManager
                        defaultValue={[
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                            true,
                        ]}
                        onSave={(value) => console.log(value)}
                    />
                    <PricingPlanManager
                        defaultValue={null}
                        onSave={(value) => console.log(value)}
                    />
                    <HolidayManager
                        defaultValue={false}
                        onSave={(value) => console.log(value)}
                    />
                    <BusinessHourManager
                        defaultValue={{ openingHr: 9, closingHr: 18 }}
                        onSave={(value) => {
                            console.log(value);
                            return;
                        }}
                    />
                    <StockManager
                        defaultValue={5}
                        onSave={(value) => {
                            console.log(value);
                        }}
                    />
                </div>
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
