import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Container } from "@element";
import { PageHeader } from "@comp";

import { Header, Footer } from "@layout";

export default function ByLaws() {
    return (
        <div className="bg-gray-50">
            <Head>
                <title>time book | 特定商取引法に基づく表示</title>
            </Head>
            <Header />
            <main>
                <PageHeader>特定商取引法に基づく表示</PageHeader>
                <Container className="py-12 space-y-12 md:py-20 md:space-y-20">
                    {/* Blob */}
                    <div>
                        <div className="space-y-6 text-lg text-gray-500 md:px-40">
                            <p>
                                「株式会社シークエンス(以下「弊社」といいます。)が運営するウェブサイト「time
                                book」上においてゲストとの間でスペース
                                の利用及びイベント参加に関する契約を締結する事業者は、弊社ではなく、弊社とホスト契約その他の契約を締結し、「time
                                book」に登録している各個人又は法人(以下「ホスト等」といいます。)となります。以下には、各ホスト等について共通に適用
                                される事項を定めており、個別の事項は各スペースの利用・イベント参加申込みページをご確認ください。
                            </p>
                            <h3 className="font-bold">1. 提供事業者</h3>
                            <p>
                                「time
                                book」で表示している各スペース・イベントの提供事業者の氏名又は名称は、各スペースの利用・イベント参加申込みペー
                                ジに記載されています。各提供事業者の住所、電話番号、通信販売に関する業務の責任者その他の法定記載事項については、請求
                                があった後に適宜提供致しますので、必要な方は下記お問い合わせ先までご連絡ください。
                            </p>
                            <h3 className="font-bold">
                                2. スペース利用・イベント参加の販売価格
                            </h3>
                            <p>
                                各スペースの利用・イベント参加申込みページにて表示する価格(消費税および「time
                                book」利用手数料を含みます。)となりま す。
                            </p>
                            <h3 className="font-bold">
                                3. 代金の支払時期、支払い方法について
                            </h3>
                            <p>
                                スペース利用については、各スペースの利用を申込み、予約リクエストが承認された時点(「即時予約」については利用を申し込
                                んだ時点)で代金をお支払い頂きます。
                            </p>
                            <p>
                                イベント参加については、各イベントの参加を申し込んだ時点で代金をお支払い頂きます。

                            </p>
                            <p>
                                支払方法は、スペース利用・イベント参加ともにクレジットカードとなります。
                            </p>
                            <h3 className="font-bold">

                                4. 返品・キャンセルに関する特約
                            </h3>
                            <p>
                                ご利用者の都合により、各スペースの利用・イベント参加申込みページにて、当該スペース・イベントの返品・キャンセルされる
                                場合は各スペース、イベントごとにキャンセルポリシーを表示しておりますので、お申込み前に必ずご確認ください。
                            </p>
                            <h3 className="font-bold">
                                5. お申し込みの有効期限等
                            </h3>
                            <p>
                                お申込みの有効期限及び・お支払いの期限は、各会場のホスト等が指定した期日になります。期日までにホスト等による承諾及び
                                お支払いが無い場合は、自動的にキャンセル扱いとなりますので、ご了承下さい。
                            </p>
                            <h3 className="font-bold">6. 特別の販売条件</h3>
                            <p>
                                該当するスペース・イベントについては、当該スペースの利用・イベント参加申込みページにて表示しております。
                            </p>
                            <p>
                                弊社では、以上の記載事項以外に「特定商取引法」に基づく表示項目に関しご請求があった場合、適宜対応いたします。
                                <br />
                                time book 運営事業者:株式会社シークエンス

                                <br />
                                お問い合わせ先:{" "}
                                <a
                                    href="mailto:info@timebook.co.jp"
                                    className="underline hover:text-gray-600"
                                >
                                    info@timebook.co.jp
                                </a>
                                <br />
                                所在地: 東京都大田区大森北4-12-3 CASA K 2C
                            </p>
                            <p className="text-sm">
                                ※お取引やサービスについてのお問い合わせについてはお電話でお受けすることができません。
                                <br />
                                大変申し訳ありませんが、timebookヘルプページのお問い合わせフォームよりご連絡をお願いいたします。
                                <br />
                                ご不便をおかけいたしますが、ご理解ご協力をよろしくお願いいたします。

                            </p>
                        </div>
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
