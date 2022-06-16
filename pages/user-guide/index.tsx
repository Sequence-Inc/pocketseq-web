import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@element";
import { ICategoryItem, RegisterCTAGuest, HeroSection } from "@comp";
import {
    SearchIcon,
    CalendarIcon,
    CreditCardIcon,
    BadgeCheckIcon,
} from "@heroicons/react/outline";
import { Header, Footer } from "@layout";
import { CTA, CTAButton } from "src/components/CTA";
import { config } from "src/utils";
import { getSession } from "next-auth/react";

const steps: any[] = [
    {
        title: "レンタルスペースを探す",
        subTitle: "エリア、利用目的、日時などから最適なスペースを検索",
        Icon: SearchIcon,
    },
    {
        title: "会員登録して予約",
        subTitle: "会員登録を行い、フォームより予約をする。",
        Icon: CalendarIcon,
    },
    {
        title: "決済する",
        subTitle: "予約したレンタルスペースを決済して予約確定",
        Icon: CreditCardIcon,
    },
    {
        title: "利用する",
        subTitle: "利用当日の流れにて、レンタルスペースを利用する",
        Icon: BadgeCheckIcon,
    },
];

export default function UserGuide({ userSession }) {
    return (
        <div className="bg-gray-50">
            <Head>
                <title>{config.appName} | User Registration Guide</title>
            </Head>
            <Header userSession={userSession} />
            <main>
                <HeroSection />
                <Container className="py-12 space-y-12 md:py-20 md:space-y-20">
                    {/* Blob */}
                    <div>
                        <div className="relative">
                            <div className="mx-auto text-center">
                                <p className="mt-2 text-2xl tracking-tight text-primary sm:text-3xl">
                                    ご利用の流れ
                                </p>
                                <p className="w-4/5 mx-auto mt-6 text-xl font-light text-gray-500">
                                    ゴーシュは二つ療たりそれを習えてくれた。壁も栗にそうになりてあたりを譜のようをわらいてゴーシュを云いてぐっと音をいえがいまし。何とかごくごくおしまいがセロをむしっなた。
                                </p>
                                <div className="space-y-5 mt-12">
                                    {steps.map(
                                        ({ Icon, title, subTitle }, index) => (
                                            <div className="px-4 py-5 flex space-x-5 rounded-lg bg-white shadow max-w-2xl mx-auto">
                                                <button className="bg-primary h-12 w-12 flex justify-center items-center rounded-lg flex-shrink-0">
                                                    <Icon className="w-6 h-6 text-white" />
                                                </button>
                                                <div className="text-left">
                                                    <p className="text-sm text-gray-500 ">
                                                        STEP {index + 1}
                                                    </p>
                                                    <h2 className="text-2xl font-medium text-primary mt-1">
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
                                    <Link href="/user-guide">
                                        <a className="inline-flex items-center justify-center mx-5 my-2 text-base font-medium text-gray-500 hover:text-primary">
                                            ホストの流れへ
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <CTA title="本サイトを安心にお使いいただくために">
                        <div className="flex justify-center mt-10 space-x-4">
                            <CTAButton link="/auth/register">
                                ゲスト登録する
                            </CTAButton>
                            <CTAButton link="/user-guide/nagare">
                                詳しく見る
                            </CTAButton>
                        </div>
                    </CTA>
                </Container>
            </main>

            <Footer />
        </div>
    );
}

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    return {
        props: {
            userSession,
        },
    };
};
