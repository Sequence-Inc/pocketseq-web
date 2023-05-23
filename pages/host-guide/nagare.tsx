import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Container } from "@element";
import { HeroSection } from "@comp";

import { Header, Footer } from "@layout";
import { config } from "src/utils";
import { getSession } from "next-auth/react";

const steps: any[] = [
    {
        title: "会員制",
        subTitle:
            "ゲストはすべて会員登録頂き、安心してスペースをご提供できるような体制です。",
    },
    {
        title: "メッセージ機能",
        subTitle:
            "予約後は、ゲストと直接メッセージ機能にてやり取りが可能です。安心してご利用いただけます。",
    },
    {
        title: "お支払いについて",
        subTitle:
            "ゲストの決済は、決済代行会社の与信システムを通過したゲストのみとなります。サービス提供者としても安心したサービスとなります。",
    },
];

export default function HostNagare({ userSession }) {
    return (
        <div className="bg-gray-50">
            <Head>
                <title>{config.appName} | 信頼への取り組み</title>
            </Head>
            <Header userSession={userSession} />
            <main>
                <HeroSection />
                <Container className="py-12 space-y-12 md:py-20 md:space-y-20">
                    {/* Blob */}
                    <div>
                        <div className="relative">
                            <div className="mx-auto text-center">
                                <div className="mt-2 text-2xl tracking-tight text-primary sm:text-3xl">
                                    信頼への取り組み
                                </div>
                                <div className="space-y-5 mt-12">
                                    {steps.map(
                                        ({ Icon, title, subTitle }, index) => (
                                            <div className="px-4 py-5 flex space-x-5 rounded-lg bg-white shadow max-w-2xl mx-auto">
                                                <div className="text-left">
                                                    <h2 className="text-2xl font-medium text-primary mt-1">
                                                        <span className="text-lg text-gray-500 mr-2">
                                                            その{index + 1}
                                                        </span>
                                                        {title}
                                                    </h2>
                                                    <div className="text-gray-500 mt-2">
                                                        {subTitle}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="max-w-2xl mx-auto mt-10 grid grid-cols-2">
                                    <Link href="/auth/host-register">
                                        <a className="inline-flex items-center justify-center px-5 py-2 text-base font-medium text-gray-600 bg-white border border-transparent rounded-md hover:bg-gray-50 shadow">
                                            今すぐホスト登録する
                                        </a>
                                    </Link>
                                    <Link href="/user-guide">
                                        <a className="inline-flex items-center justify-center mx-5 my-2 text-base font-medium text-gray-500 hover:text-primary">
                                            ゲストの流れへ
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}

export const getServerSideProps = async (context) => {
    const session = await getSession(context);
    return {
        props: {
            userSession: session,
        },
    };
};
