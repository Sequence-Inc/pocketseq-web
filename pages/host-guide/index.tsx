import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@element";
import { RegisterCTA, HeroSection } from "@comp";
import {
    UserAddIcon,
    ClipboardCheckIcon,
    CalendarIcon,
    LibraryIcon,
    DocumentTextIcon,
} from "@heroicons/react/outline";
import { Header, Footer } from "@layout";
import { CTA, CTAButton } from "src/components/CTA";
import { config } from "src/utils";
import { getSession } from "next-auth/react";

const steps: any[] = [
    {
        title: "ホスト会員登録",
        subTitle: "ホスト基本情報をご登録の上、会員登録を行います。",
        Icon: UserAddIcon,
    },
    {
        title: "審査（数日程度）",
        subTitle:
            "身分証の確認や宿泊業免許など確認による審査をさせていただきます。",
        Icon: DocumentTextIcon,
    },
    {
        title: "掲載スペース情報の登録",
        subTitle: "スペース情報、料金、在庫設定を行います。",
        Icon: ClipboardCheckIcon,
    },
    {
        title: "予約",
        subTitle:
            "ゲストからの予約（決済済み）を確認し当日のご対応を行います。",
        Icon: CalendarIcon,
    },
    {
        title: "利用する",
        subTitle:
            "当サービスより月末締め、翌月15日に手数料分を差し引いた料金をお振込みいたします。",
        Icon: LibraryIcon,
    },
];

export default function HostGuide({ userSession }) {
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
                                <div className="mt-2 text-2xl tracking-tight text-primary sm:text-3xl">
                                    ご利用の流れ
                                </div>
                                <div className="w-4/5 mx-auto mt-6 text-xl font-light text-gray-500">
                                    ゴーシュは二つ療たりそれを習えてくれた。壁も栗にそうになりてあたりを譜のようをわらいてゴーシュを云いてぐっと音をいえがいまし。何とかごくごくおしまいがセロをむしっなた。
                                </div>
                                <div className="space-y-5 mt-12">
                                    {steps.map(
                                        ({ Icon, title, subTitle }, index) => (
                                            <div className="px-4 py-5 flex space-x-5 rounded-lg bg-white shadow max-w-2xl mx-auto">
                                                <button className="bg-primary h-12 w-12 flex justify-center items-center rounded-lg flex-shrink-0">
                                                    <Icon className="w-6 h-6 text-white" />
                                                </button>
                                                <div className="text-left">
                                                    <div className="text-sm text-gray-500 ">
                                                        STEP {index + 1}
                                                    </div>
                                                    <h2 className="text-2xl font-medium text-primary mt-1">
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
                    <CTA title="信頼への取り組み">
                        <div className="flex justify-center mt-10 space-x-4">
                            <CTAButton link="/auth/host-register">
                                ホスト登録する
                            </CTAButton>
                            <CTAButton link="/host-guide/nagare">
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
    const session = await getSession(context);
    return {
        props: {
            userSession: session,
        },
    };
};
