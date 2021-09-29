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
        name: "Host Dashboard",
        href: "/host",
        Icon: HomeIcon,
        roles: ["host"],
    },
    {
        name: "Dashboard",
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
        name: "Spaces",
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
        name: "Spaces",
        href: "/host/my-space",
        Icon: ViewListIcon,
        roles: ["host"],
    },
    {
        name: "Reservations",
        href: "#",
        Icon: CalendarIcon,
        roles: ["host"],
    },
    {
        name: "Messages",
        href: "#",
        Icon: MailIcon,
        roles: ["user", "host"],
    },
    {
        name: "Settings",
        href: "#",
        Icon: CogIcon,
        roles: ["host"],
    },
    {
        name: "Back to Timebook",
        href: "/",
        Icon: ArrowLeftIcon,
        roles: ["user", "host", "admin"],
    },
];
