import React from "react";
import Head from "next/head";
import { Container } from "@element";
import { PageHeader } from "@comp";

import { Header, Footer } from "@layout";
import Link from "next/link";
import { config } from "src/utils";
import { getSession } from "next-auth/react";

export default function ByLaws({ userSession }) {
    return (
        <div className="bg-gray-50">
            <Head>
                <title>{config.appName} | 約款</title>
            </Head>
            <Header userSession={userSession} />
            <main>
                <PageHeader>約款</PageHeader>
                <Container className="py-12 space-y-12 md:py-20 md:space-y-20">
                    {/* Blob */}
                    <div>
                        <div className="space-y-6 text-lg text-gray-500 md:px-40">
                            <table className="table w-full">
                                <tbody>
                                    <tr>
                                        <td className="border px-2 md:px-8 py-2 w-1/3 md:w-1/4">
                                            業務範囲
                                        </td>
                                        <td className="border px-4 py-2">
                                            国内旅行
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="border px-2 md:px-8 py-2">
                                            登録番号
                                        </td>
                                        <td className="border px-4 py-2">
                                            第3－8169
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border px-2 md:px-8 py-2">
                                            登録年月日
                                        </td>
                                        <td className="border px-4 py-2">
                                            令和4年1月6日
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="border px-2 md:px-8 py-2">
                                            有効期限
                                        </td>
                                        <td className="border px-4 py-2">
                                            令和9年1月5日
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border px-2 md:px-8 py-2">
                                            会社名
                                        </td>
                                        <td className="border px-4 py-2">
                                            株式会社シークエンス
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="border px-2 md:px-8 py-2">
                                            住所
                                        </td>
                                        <td className="border px-4 py-2">
                                            東京都大田区大森北4-12-3 CASA K 2C
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border px-2 md:px-8 py-2">
                                            会社名
                                        </td>
                                        <td className="border px-4 py-2">
                                            株式会社シークエンス
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="border px-2 md:px-8 py-2">
                                            旅行業務取扱
                                            <br />
                                            管理者
                                        </td>
                                        <td className="border px-4 py-2">
                                            今野 敬
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border px-2 md:px-8 py-2">
                                            会社名
                                        </td>
                                        <td className="border px-4 py-2">
                                            株式会社シークエンス
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="border px-2 md:px-8 py-2">
                                            旅行業約款
                                        </td>
                                        <td className="border px-4 py-2">
                                            <Link href="/downloads/旅行業約款.pdf">
                                                <a className="underline hover:text-gray-600">
                                                    こちらからご確認ください
                                                </a>
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border px-2 md:px-8 py-2">
                                            お客様窓口
                                        </td>
                                        <td className="border px-4 py-2">
                                            <Link href="mailto:info@pocketseq.com">
                                                <a className="underline hover:text-gray-600">
                                                    こちらからお問い合わせください
                                                </a>
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
