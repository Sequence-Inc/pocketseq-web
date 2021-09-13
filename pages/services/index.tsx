import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@element";
import {
    ICategoryItem,
    RegisterCTA,
    RegisterCTAAlt,
    HeroSection,
} from "@comp";
import { Header, Footer } from "@layout";
import { useQuery } from "@apollo/client";
import { GET_ALL_SPACE_TYPES } from "src/apollo/queries/space.queries";

const categories: ICategoryItem[] = [
    {
        title: "Business × TimeBook",
        subTitle: "オフサイトMTGやブレストMTGなどに最適",
        photo: "/service1.jpg",
    },
    {
        title: "Lifestyle × TimeBook",
        subTitle: "オフサイトMTGやブレストMTGなどに最適",
        photo: "/service2.jpg",
    },
    {
        title: "Outdoor × TimeBook",
        subTitle: "オフサイトMTGやブレストMTGなどに最適",
        photo: "/service3.jpg",
    },
    {
        title: "Learning × TimeBook",
        subTitle: "オフサイトMTGやブレストMTGなどに最適",
        photo: "/service4.jpg",
    },
    {
        title: "Nightlife × TimeBook",
        subTitle: "オフサイトMTGやブレストMTGなどに最適",
        photo: "/service5.jpg",
    },
    {
        title: "Relax × TimeBook",
        subTitle: "オフサイトMTGやブレストMTGなどに最適",
        photo: "/service6.jpg",
    },
];

export default function Services() {
    const { data: spaceTypes } = useQuery(GET_ALL_SPACE_TYPES);
    console.log(spaceTypes);
    return (
        <div className="bg-gray-50">
            <Head>
                <title>TimeBook</title>
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
                                <div className="grid grid-cols-1 gap-4 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
                                    {categories.map(res => (
                                        <Link href="/search">
                                            <a>
                                                <div className="relative overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                                                    {res.photo &&
                                                        <Image
                                                            layout="fill"
                                                            src={res.photo}
                                                            alt="category items"
                                                            className="object-cover w-full h-full"
                                                        />}
                                                    <div className="flex flex-col justify-center p-3 bg-gray-900 bg-opacity-50 text-gray-50 hover:bg-opacity-75">
                                                        <h4 className="mb-4 text-lg font-semibold">{res.title}</h4>
                                                        <span className="px-3">{res.subTitle}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <RegisterCTAAlt />

                    <RegisterCTA />
                </Container>
            </main>

            <Footer />
        </div>
    );
}
