import {
    HomeIcon,
    ViewListIcon,
    ArrowLeftIcon,
    CalendarIcon,
    CogIcon,
    UsersIcon,
    MailIcon,
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
        name: "Hosts",
        href: "/admin/hosts",
        Icon: UsersIcon,
        roles: ["admin"],
    },
    {
        name: "施設管理",
        href: "#",
        Icon: ViewListIcon,
        roles: ["admin"],
    },
    {
        name: "Settings",
        href: "/admin/settings/",
        Icon: CogIcon,
        roles: ["admin"],
    },
    {
        name: "施設管理",
        href: "/host/my-space",
        Icon: ViewListIcon,
        roles: ["host"],
    },
    {
        name: "予約の確認",
        href: "#",
        Icon: CalendarIcon,
        roles: ["host"],
    },
    {
        name: "メッセージ",
        href: "#",
        Icon: MailIcon,
        roles: ["user", "host"],
    },
    {
        name: "設定",
        href: "#",
        Icon: CogIcon,
        roles: ["host"],
    },
    {
        name: "time bookにもどる",
        href: "/",
        Icon: ArrowLeftIcon,
        roles: ["user", "host", "admin"],
    },
];
