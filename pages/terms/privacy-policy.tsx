import React from "react";
import Head from "next/head";
import { Container } from "@element";
import { PageHeader } from "@comp";

import { Header, Footer } from "@layout";
import { config } from "src/utils";
import { getSession } from "next-auth/react";

export default function PrivaryPolicy({ userSession }) {
    return (
        <div className="bg-gray-50">
            <Head>
                <title>{config.appName} | プライバシーポリシー</title>
            </Head>
            <Header userSession={userSession} />
            <main>
                <PageHeader>{config.appName} プライバシーポリシー</PageHeader>
                <Container className="py-12 space-y-5 md:py-20 md:space-y-5 text-gray-500">
                    <p>
                        株式会社シークエンス(以下「当社」)は、本ウェブサイト「
                        {config.appName}」上で提供するサー
                        ビス(以下、「本サービス」)におけるプライバシー情報の取扱いについて、以下の通りプラ
                        イバシーポリシー(以下、「本ポリシー」)を定めます。
                    </p>
                    <h2 className="font-bold text-lg">
                        第 1 条(プライバシー情報)
                    </h2>
                    <p>
                        プライバシー情報のうち「個人情報」とは、個人情報保護法にいう「個人情報」を指すもの
                        とし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電
                        話番号、連絡先その他の記述等により特定の個人を識別できる情報を指します。
                    </p>
                    <p>
                        プライバシー情報のうち「履歴情報および特性情報」とは、上記に定める「個人情報」以外
                        のものをいい、ご利用いただいた掲載施設またはサービス、ご覧になったページやコンテン
                        ツの履歴、利用者が検索された検索キーワード、ご利用日時、ご利用の方法、ご利用環境、
                        郵便番号や性別、職業、年齢、利用者の IP
                        アドレス、クッキー情報、位置情報、端末の個
                        体識別情報などを指します。
                    </p>

                    <h2 className="font-bold text-lg">
                        第 2 条(プライバシー情報の収集方法)
                    </h2>
                    <p>
                        当社は、利用者が利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、
                        銀行口座番号、クレジットカード番号、運転免許証番号などの個人情報をお尋ねすることが
                        あります。また、利用者と提携先などとの間でなされた利用者の個人情報を含む取引記録や、
                        決済に関する情報を当社の提携先(情報提供元、広告主、広告配信先などを含みます。以下
                        「提携先」)などから収集することがあります。
                    </p>
                    <p>
                        当社は、利用者について、利用した施設またはサービス、閲覧したページやコンテンツの履
                        歴、検索した検索キーワード、利用日時、利用方法、利用環境(携帯端末を通じてご利用の
                        場合の当該端末の通信状態、利用に際しての各種設定情報なども含みます)、IP
                        アドレス、
                        クッキー情報、位置情報，端末の個体識別情報などの履歴情報および特性情報を、利用者が
                        当社や提携先のサービスを利用しまたはページを閲覧する際に収集します。
                    </p>
                    <h2 className="font-bold text-lg">
                        第 3 条(個人情報を収集・利用する目的)
                    </h2>
                    <p>
                        当社が個人情報を収集・利用する目的は、以下の通りです。
                    </p>
                    <p>
                        利用者に自分の登録情報の閲覧や修正、利用状況の閲覧を行っていただくために、氏名、住
                        所、連絡先、支払方法などの登録情報、利用された施設またはサービス、及びそれらの代金
                        などに関する情報を表示する目的
                    </p>
                    <p>
                        利用者にお知らせや連絡をするためにメールアドレスを利用する場合や、利用者に商品を
                        送付したり必要に応じて連絡したりするため、氏名や住所などの連絡先情報を利用する目
                        的
                    </p>
                    <p>
                        利用者の本人確認を行うために、氏名、生年月日、住所、電話番号、銀行口座番号、クレジ
                        ットカード番号、運転免許証番号、配達証明付き郵便の到達結果などの情報を利用する目的
                        利用者に代金を請求するために、利用されたサービスの種類、回数、請求金額、氏名、住所、
                        銀行口座番号やクレジットカード番号などの支払に関する情報などを利用する目的
                        利用者が簡便にデータを入力できるようにするために、当社に登録されている情報を入力
                        画面に表示させたり、利用者のご指示に基づいて他のサービスなど(提携先が提供するもの
                        も含みます)に転送したりする目的
                    </p>
                    <p>
                        代金の支払を遅滞したり第三者に損害を発生させたりするなど、本サービスの利用規約に
                        違反した利用者や、不正・不当な目的でサービスを利用しようとする利用者の利用をお断り
                        するために、利用態様、氏名や住所など個人を特定するための情報を利用する目的
                    </p>
                    <p>
                        利用者からのお問い合わせに対応するために、お問い合わせ内容や代金の請求に関する情
                        報など、当社が利用者に対してサービスを提供するにあたって必要となる情報や、利用者の
                        サービス利用状況、連絡先情報などを利用する目的
                    </p>
                    <p>上記の利用目的に付随する目的</p>
                    <h2 className="font-bold text-lg">
                        第 4 条(個人情報の第三者提供)
                    </h2>
                    <p>
                        当社は、次に掲げる場合を除いて、あらかじめ利用者の同意を得ることなく、第三者に個人
                        情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合
                        を除きます。
                    </p>
                    <p>法令に基づく場合</p>
                    <p>
                        人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ること
                        が困難であるとき
                    </p>
                    <p>
                        公衆衛生の向上、または児童の健全な育成の推進のために特に必要がある場合であって、本
                        人の同意を得ることが困難であるとき
                    </p>
                    <p>
                        国の機関もしくは地方公共団体、またはその委託を受けた者が、法令の定める事務を遂行す
                        ることに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務
                        の遂行に支障を及ぼすおそれがあるとき
                    </p>
                    <p>予め次の事項を告知あるいは公表をしている場合</p>
                    <p>利用目的に第三者への提供を含むこと</p>
                    <p>第三者に提供されるデータの項目</p>
                    <p>第三者への提供の手段または方法</p>
                    <p>
                        本人の求めに応じて個人情報の第三者への提供を停止すること
                    </p>
                    <p>
                        前項の定めにかかわらず、次に掲げる場合は第三者には該当しないものとします。
                    </p>
                    <p>
                        当社が利用目的の達成に必要な範囲内において、個人情報の取扱いの全部または一部を委
                        託する場合
                    </p>
                    <p>
                        合併その他の事由による事業の承継に伴って個人情報が提供される場合
                    </p>
                    <p>
                        個人情報を特定の者との間で共同して利用する場合であって、その旨並びに共同して利用
                        される個人情報の項目、共同して利用する者の範囲、利用する者の利用目的および当該個人
                        情報の管理について責任を有する者の氏名または名称について、あらかじめ本人に通知し、
                        または本人が容易に知り得る状態に置いているとき
                    </p>
                    <h2 className="font-bold text-lg">
                        第 5 条(個人情報の開示)
                    </h2>
                    <p>
                        当社は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示し
                        ます。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を
                        開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。な
                        お、個人情報の開示に際しては、1件あたり1，000円の手数料を申し受けます。
                    </p>
                    <p>
                        本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合
                    </p>
                    <p>
                        当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合
                    </p>
                    <p>
                        前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、
                        原則として開示いたしません。
                    </p>
                    <h2 className="font-bold text-lg">
                        第 6 条(個人情報の訂正および削除)
                    </h2>
                    <p>
                        利用者は、当社の保有する自己の個人情報が誤った情報である場合には、当社が定める手続
                        きにより、当社に対して個人情報の訂正または削除を請求することができます。
                    </p>
                    <p>
                        当社は、利用者から前項の請求を受けてその請求に応じる必要があると判断した場合には、
                        遅滞なく当該個人情報の訂正または削除を行い、これを利用者に通知します。
                    </p>
                    <h2 className="font-bold text-lg">
                        第 7 条(個人情報の利用停止等)
                    </h2>
                    <p>
                        当社は本人から、個人情報が利用目的の範囲を超えて取り扱われているという理由、または
                        不正の手段により取得されたものであるという理由により、その利用の停止または消去(以
                        下、「利用停止等」)を求められた場合には、遅滞なく必要な調査を行い、その結果に基づき
                        個人情報の利用停止等を行い、その旨本人に通知します。ただし、個人情報の利用停止等に
                        多額の費用を有する場合、その他利用停止等を行うことが困難な場合であって、本人の権利
                        利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じま
                        す。
                    </p>
                    <h2 className="font-bold text-lg">
                        第 8 条(プライバシーポリシーの変更)
                    </h2>
                    <p>
                        本ポリシーの内容は、利用者に通知することなく、変更することができるものとします。
                        当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載
                        したときから効力を生じるものとします。
                    </p>
                    <h2 className="font-bold text-lg">
                        第 9 条(お問い合わせ窓口)
                    </h2>
                    <p>
                        本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
                    </p>
                    <p>
                        〒143-0016
                        <br />
                        東京都大田区大森北 4-12-3 CASA K 2C
                        <br />
                        株式会社シークエンス
                        <br />
                        {config.appName} 担当者宛
                        <br />
                        E-mail: info@timebook.jp
                        <br />
                        (なお、受付時間は、平日 10 時から 17
                        時までとさせていただきます。)
                        <br />
                        【2018 年 12 月 1 日制定】
                    </p>
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
