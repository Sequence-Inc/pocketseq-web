import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Container } from "@element";
import { HeroSection } from "@comp";

import { Header, Footer } from "@layout";

const steps: any[] = [
    {
        title: "審査",
        subTitle:
            "全てのサービス提供者は、身分証明書および免許などの審査を行い、審査を通過したスペースのみ掲載しております。",
    },
    {
        title: "メッセージ機能",
        subTitle:
            "予約後は、サービス提供者と直接メッセージ機能にてやり取りが可能です。安心してご利用いただけます。",
    },
    {
        title: "お支払いについて",
        subTitle:
            "スペース予約後にtime bookへお支払いとなります。キャンセル時はキャンセルポリシーが適用され、料金が処理されますので、ご安心してご利用いただけます。",
    },
];

export default function UserNagare() {
    return (
        <div className="bg-gray-50">
            <Head>
                <title>TimeBook | 安心への取り組み</title>
            </Head>
            <Header />
            <main>
                <HeroSection />
                <Container className="py-12 space-y-12 md:py-20 md:space-y-20">
                    {/* Blob */}
                    <div>
                        <div className="relative">
                            <div className="mx-auto text-center">
                                <p className="mt-2 text-2xl tracking-tight text-primary sm:text-3xl">
                                    安心への取り組み
                                </p>
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
                                                    <p className="text-gray-500 mt-2">
                                                        {subTitle}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="max-w-2xl mx-auto mt-10 grid grid-cols-2">
                                    <Link href="/auth/register">
                                        <a className="inline-flex items-center justify-center px-5 py-2 text-base font-medium text-gray-600 bg-white border border-transparent rounded-md hover:bg-gray-50 shadow">
                                            今すぐゲスト登録する
                                        </a>
                                    </Link>
                                    <Link href="/host-guide">
                                        <a className="inline-flex items-center justify-center mx-5 my-2 text-base font-medium text-gray-500 hover:text-primary">
                                            ホストの流れへ
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
