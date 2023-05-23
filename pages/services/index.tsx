import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@element";
import {
    ICategoryItem,
    HeroSection,
    RegisterCTAGuest,
    RegisterCTAHost,
} from "@comp";
import { Header, Footer } from "@layout";
import { config } from "src/utils";
import { getSession } from "next-auth/react";

const categories: ICategoryItem[] = [
    {
        title: `Business × ${config.appName}`,
        subTitle: "オフサイトMTGやブレストMTGなどに最適",
        photo: "/services/meeting.jpg",
    },
    {
        title: `Freelance × ${config.appName}`,
        subTitle: "フリーランスの方がスキル提供する場所を拡大",
        photo: "/services/makeup.jpg",
    },
    {
        title: `Lifestyle × ${config.appName}`,
        subTitle: "体験してみたかった事を気軽に予約",
        photo: "/services/sauna.jpg",
    },
    {
        title: `Outdoor × ${config.appName}`,
        subTitle: "家のそばでも旅先でもいつでもオープンスペースを探せます",
        photo: "/services/lifestyle.jpg",
    },
    {
        title: `Party × ${config.appName}`,
        subTitle: "スタイリッシュ空間で特別なパーティを",
        photo: "/services/music.jpg",
    },
    {
        title: `Learninng × ${config.appName}`,
        subTitle: "身近な習い事を見つける事ができる",
        photo: "/services/party.jpg",
    },
];

export default function Services({ userSession }) {
    return (
        <div className="bg-gray-50">
            <Head>
                <title>{config.appName} | Services</title>
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
                                    サービスについて
                                </div>
                                <div className="w-4/5 mx-auto mt-6 text-xl font-light text-gray-500">
                                    ゴーシュは二つ療たりそれを習えてくれた。壁も栗にそうになりてあたりを譜のようをわらいてゴーシュを云いてぐっと音をいえがいまし。何とかごくごくおしまいがセロをむしっなた。
                                </div>
                                <div className="grid grid-cols-1 gap-4 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
                                    {categories.map((res) => (
                                        <Link href="/search" key={res.photo}>
                                            <a>
                                                <div className="relative overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                                                    {res.photo && (
                                                        <img
                                                            src={res.photo}
                                                            alt="category items"
                                                            className="object-cover w-full h-full"
                                                        />
                                                    )}
                                                    <div className="flex flex-col justify-center p-3 bg-gray-900 bg-opacity-50 text-gray-50 hover:bg-opacity-75">
                                                        <h4 className="mb-4 text-lg font-semibold">
                                                            {res.title}
                                                        </h4>
                                                        <span className="px-3">
                                                            {res.subTitle}
                                                        </span>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <RegisterCTAGuest />
                    <RegisterCTAHost />
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
