import {
    HomeIcon,
    ViewListIcon,
    ArrowLeftIcon,
    CalendarIcon,
    CogIcon,
    UsersIcon,
    MailIcon,
    UserCircleIcon,
    BadgeCheckIcon,
} from "@heroicons/react/outline";

export const navigation = [
    {
        name: "ダッシュボード",
        href: "/host",
        Icon: HomeIcon,
        roles: ["host"],
    },
    {
        name: "ダッシュボード",
        href: "/admin",
        Icon: HomeIcon,
        roles: ["admin"],
    },
    {
        name: "Accounts",
        href: "/admin/accounts",
        Icon: UsersIcon,
        roles: ["admin"],
    },
    {
        name: "ホスト",
        href: "/admin/hosts",
        Icon: UsersIcon,
        roles: ["admin"],
    },
    {
        name: "システム設定",
        href: "/admin/settings/",
        Icon: CogIcon,
        roles: ["admin"],
    },
    {
        name: "プロフィール",
        href: "/user/profile",
        Icon: UserCircleIcon,
        roles: ["user"],
    },
    {
        name: "設定",
        href: "/user/settings",
        Icon: CogIcon,
        roles: ["user"],
    },
    {
        name: "予約",
        href: "/user/reservation",
        Icon: CalendarIcon,
        roles: ["user"],
    },
    {
        name: "予約",
        href: "/host/reservation",
        Icon: CalendarIcon,
        roles: ["host"],
    },
    {
        name: "施設管理",
        href: "/host/my-space",
        Icon: ViewListIcon,
        roles: ["host"],
    },
    {
        name: "メッセージ",
        href: "/messages",
        Icon: MailIcon,
        roles: ["user", "host"],
    },
    // {
    //     name: "設定",
    //     href: "#",
    //     Icon: CogIcon,
    //     roles: ["host"],
    // },
    {
        name: "トップに戻る",
        href: "/",
        Icon: ArrowLeftIcon,
        roles: ["user", "host", "admin"],
    },
];
