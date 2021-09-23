import {
    HomeIcon,
    ViewListIcon,
    ArrowLeftIcon,
    CalendarIcon,
    CogIcon,
} from "@heroicons/react/outline";

export const navigation = [
    {
        name: "Host Dashboard",
        href: "/user-host",
        Icon: HomeIcon,
        roles: ["host"],
    },
    {
        name: "Spaces",
        href: "/user-host/my-space",
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
        name: "Settings",
        href: "#",
        Icon: CogIcon,
        roles: ["host"],
    },
    {
        name: "Back to Timebook",
        href: "/",
        Icon: ArrowLeftIcon,
        roles: ["user", "host"],
    },
];
