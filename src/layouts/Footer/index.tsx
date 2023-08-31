import React from "react";
import Link from "next/link";
import { config } from "src/utils";
import moment from "moment";
import { DocumentTextIcon } from "@heroicons/react/outline";

const Footer = () => {
    return (
        <footer className="bg-gray-800" aria-labelledby="footer-heading">
            <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:py-16 lg:px-8">
                <div className="grid grid-cols-2 gap-8">
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        {/* <div>
                            <h3 className="text-lg font-medium tracking-wider text-gray-200">
                                レンタルスペースを探す
                            </h3>
                            <ul className="mt-4 space-y-2">
                                {navigation.find.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href}>
                                            <a className="text-sm text-gray-300 hover:text-white">
                                                {item.name}
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div> */}
                        <div>
                            <h3 className="text-lg font-bold tracking-wider text-gray-200">
                                ご利用ガイド
                            </h3>
                            <ul className="mt-4 space-y-2">
                                {navigation.guide.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href}>
                                            <a
                                                target="_blank"
                                                className="flex items-center text-sm text-gray-300 hover:text-white"
                                            >
                                                {item.name}
                                                {item.icon && item.icon}
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold tracking-wider text-gray-200">
                                {config.appName}について
                            </h3>
                            <ul className="mt-4 space-y-2">
                                {navigation.company.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href}>
                                            <a className="text-sm text-gray-300 hover:text-white">
                                                {item.name}
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <div>
                            {/* <h3 className="text-lg font-bold tracking-wider text-gray-200">
                                {config.appName}について
                            </h3>
                            <ul className="mt-4 space-y-2">
                                {navigation.company.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href}>
                                            <a className="text-sm text-gray-300 hover:text-white">
                                                {item.name}
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul> */}
                        </div>
                        <div className="flex justify-center mt-12 md:mt-0">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-400">
                                    {/* {config.appNameEnglish} */}
                                    <img
                                        src="/logo_text.svg"
                                        alt="PocketseQ"
                                        className="w-40"
                                    />
                                </h2>
                                <div className="flex mt-4 space-x-4 md:order-2">
                                    {navigation.social.map((item) => (
                                        <Link href={item.href} key={item.name}>
                                            <a
                                                target="_blank"
                                                className="text-gray-400 hover:text-gray-300"
                                            >
                                                <span className="sr-only">
                                                    {item.name}
                                                </span>
                                                <item.icon
                                                    className="w-6 h-6"
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center pt-8 mt-8 border-t border-gray-700 lg:flex-row">
                    <div className="mt-8 mr-8 text-base text-gray-400 md:mt-0">
                        &copy; {moment().format("YYYY")} {config.appNameEnglish}
                    </div>
                    <nav className="flex flex-wrap">
                        {navigation.others.map((item) => (
                            <div key={item.name} className="px-5 py-2">
                                <Link href={item.href}>
                                    <a className="text-sm text-gray-400 hover:text-white">
                                        {item.name}
                                    </a>
                                </Link>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

const navigation = {
    find: [
        { name: "利用目的から探す", href: "#" },
        { name: "エリアから探す", href: "#" },
        { name: "会場タイプから探す", href: "#" },
        { name: "こだわりから探す", href: "#" },
        { name: "設備・備品から探す", href: "#" },
        { name: "人数から探す", href: "#" },
    ],
    guide: [
        // { name: "初めての方へ", href: "/services" },
        {
            name: "ホストの方へ",
            href: "https://timebook-public-media.s3.ap-northeast-1.amazonaws.com/assets/host_manual.pdf",
            icon: <DocumentTextIcon className="w-4 h-4 ml-2" />,
        },
        {
            name: "ゲストの方へ",
            href: "https://timebook-public-media.s3.ap-northeast-1.amazonaws.com/assets/user_manual.pdf",
            icon: <DocumentTextIcon className="w-4 h-4 ml-2" />,
        },
        {
            name: "サブスク用",
            href: "/user-guide",
            icon: <DocumentTextIcon className="w-4 h-4 ml-2" />,
        },
    ],
    company: [
        {
            name: "プライバシーポリシー",
            href: "/terms/privacy-policy",
        },
        { name: "ゲスト規約", href: "/terms/guest-terms" },
        { name: "ホスト規約", href: "/terms/host-terms" },

        // { name: "アプリ", href: "#" },
    ],
    social: [
        {
            name: "Facebook",
            href: "https://www.facebook.com/profile.php?id=100086373734476",
            icon: (props) => (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        {
            name: "Instagram",
            href: "https://www.instagram.com/pocketseq/",
            icon: (props) => (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        {
            name: "Line",
            href: "https://page.line.me/124ltknv",
            icon: (props) => (
                <svg fill="currentColor" viewBox="0 0 320 320" {...props}>
                    <path d="m122.21,168.67v7.57c0,1.13-.92,2.04-2.04,2.04h-30.01c-1.13,0-2.04-.91-2.04-2.04v-46.62c0-1.12.91-2.04,2.04-2.04h7.57c1.12,0,2.04.92,2.04,2.04v37.01h20.4c1.12,0,2.04.91,2.04,2.04Z" />
                    <path d="m140.27,129.62v46.62c0,1.13-.91,2.04-2.04,2.04h-7.57c-1.13,0-2.04-.91-2.04-2.04v-46.62c0-1.12.91-2.04,2.04-2.04h7.57c1.13,0,2.04.92,2.04,2.04Z" />
                    <path d="m191.84,129.62v46.62c0,1.13-.91,2.04-2.04,2.04h-7.53c-.19,0-.37-.03-.54-.07-.01,0-.02,0-.02,0-.05-.01-.1-.03-.15-.04-.02-.01-.04-.02-.06-.03-.03-.01-.07-.03-.1-.04-.03-.02-.07-.03-.1-.05-.02-.01-.04-.02-.06-.03-.04-.03-.08-.05-.13-.08,0,0-.01-.01-.02-.02-.2-.13-.38-.3-.53-.51l-21.35-28.84v27.68c0,1.13-.91,2.04-2.04,2.04h-7.58c-1.12,0-2.03-.91-2.03-2.04v-46.62c0-1.12.91-2.04,2.03-2.04h7.54s.04.01.07.01h.11s.07.01.11.02c.03,0,.05.01.08.01.04.01.08.02.12.03.03,0,.05.01.08.02.04.01.08.02.12.03.02,0,.04.02.07.03.04.02.08.03.12.05.02.01.04.02.06.03.04.02.08.04.11.06.02.02.05.03.07.04.03.03.07.05.1.08.02.01.04.02.06.04.04.03.07.06.11.09.01.01.03.02.04.04.04.04.08.08.12.12t.01.02c.06.06.12.13.17.21l21.33,28.8v-27.69c0-1.12.91-2.04,2.04-2.04h7.57c1.13,0,2.04.92,2.04,2.04Z" />
                    <path d="m233.21,129.62v7.58c0,1.13-.91,2.04-2.04,2.04h-20.39v7.87h20.39c1.12,0,2.04.91,2.04,2.03v7.58c0,1.13-.91,2.04-2.04,2.04h-20.39v7.87h20.39c1.12,0,2.04.91,2.04,2.04v7.57c0,1.13-.91,2.04-2.04,2.04h-30.01c-1.12,0-2.04-.91-2.04-2.04v-46.62c0-1.12.92-2.04,2.04-2.04h30.01c1.12,0,2.04.92,2.04,2.04Z" />
                    <path d="m160,0C71.63,0,0,71.63,0,160s71.63,160,160,160,160-71.63,160-160S248.37,0,160,0Zm101.06,178.16c-3.79,8.82-9.51,17.36-17.25,25.85-22.41,25.8-72.52,57.21-83.92,62.02-11.4,4.8-9.72-3.06-9.25-5.76.27-1.61,1.52-9.15,1.52-9.15.36-2.72.73-6.95-.34-9.65-1.2-2.98-5.93-4.52-9.41-5.27-51.33-6.78-89.33-42.67-89.33-85.52,0-47.79,47.92-86.68,106.81-86.68s106.81,38.89,106.81,86.68c0,9.56-1.85,18.66-5.64,27.48Z" />
                </svg>
            ),
        },
        // {
        //     name: "Twitter",
        //     href: "#",
        //     icon: (props) => (
        //         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        //             <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        //         </svg>
        //     ),
        // },
    ],
    others: [
        { name: "運営会社", href: "https://www.sequence-inc.jp/" },
        // { name: "採用情報", href: "#" },
        { name: "約款", href: "/about/terms" },
        { name: "特定商取引法に基づく表示", href: "/about/bylaws" },
        // { name: "よくある質問", href: "#" },
        { name: "お問い合わせ", href: "/contact" },
    ],
};
