import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@element";
import {
    ICategoryItem,
    RegisterCTAAlt,
    HeroSection,
} from "@comp";
import { UserAddIcon,ClipboardCheckIcon,CalendarIcon,LibraryIcon } from "@heroicons/react/outline";
import { Header, Footer } from "@layout";

const steps: any[] = [
    {
        title: "ホスト会員登録",
        subTitle: "ホスト基本情報をご登録の上、会員登録を行います。",
        Icon: UserAddIcon,
    },
    {
        title: "掲載スペース情報の登録",
        subTitle: "スペース情報、料金、在庫設定を行います。",
        Icon: ClipboardCheckIcon,
    },
    {
        title: "予約",
        subTitle: "ゲストからの予約（決済済み）を確認し当日のご対応を行います。",
        Icon: CalendarIcon,
    },
    {
        title: "利用する",
        subTitle: "当サービスより月末締め、翌月15日に手数料分を差し引いた料金をお振込みいたします。",
        Icon: LibraryIcon,
    },
];

export default function HostGuide() {
    return (
        <div className="bg-gray-50">
            <Head>
                <title>TimeBook | User Registration Guide</title>
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
                                    サービスについて
                                </p>
                                <p className="w-4/5 mx-auto mt-6 text-xl font-light text-gray-500">
                                    ゴーシュは二つ療たりそれを習えてくれた。壁も栗にそうになりてあたりを譜のようをわらいてゴーシュを云いてぐっと音をいえがいまし。何とかごくごくおしまいがセロをむしっなた。
                                </p>
                                <div className="space-y-5 mt-12">
                                    {steps.map(({Icon, title, subTitle}, index) => (
                                        <div className="px-5 py-6 flex space-x-5 rounded-lg bg-white shadow max-w-xl mx-auto">
                                            <button className="bg-primary h-12 w-12 flex justify-center items-center rounded-lg flex-shrink-0">
                                                <Icon className="w-6 h-6 text-white" />
                                            </button>
                                            <div>
                                                <p className="text-sm text-gray-600 text-left">STEP {index + 1}</p>
                                                <h2 className="text-2xl text-left font-semibold text-primary mb-2">{title}</h2>
                                                <p className="text-gray-500 text-left">{subTitle}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <RegisterCTAAlt />
                </Container>
            </main>

            <Footer />
        </div>
    );
}
