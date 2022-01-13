import {
    HomeIcon,
    ViewListIcon,
    ArrowLeftIcon,
    CalendarIcon,
    CogIcon,
    UsersIcon,
    MailIcon,
    UserCircleIcon,
    BadgeCheckIcon
} from "@heroicons/react/outline";
// import {  } from "@heroicons/react/solid";

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
        name: "Profile",
        href: "/user/profile",
        Icon: UserCircleIcon,
        roles: ["user"],
    },
    {
        name: "Settings",
        href: "/user/settings",
        Icon: CogIcon,
        roles: ["user"],
    },
    {
        name: "My Reservations",
        href: "/user/reservation-list",
        Icon: BadgeCheckIcon,
        roles: ["user"],
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
        href: "/messages",
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
        name: "Reservations",
        href: "/host/reservation-list",
        Icon: BadgeCheckIcon,
        roles: ["host"],
    },
    {
        name: "トップに戻る",
        href: "/",
        Icon: ArrowLeftIcon,
        roles: ["user", "host", "admin"],
    },
];
