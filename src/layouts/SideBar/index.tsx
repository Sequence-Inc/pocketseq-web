import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Logo } from "@element";
import { navigation, projects } from "./menuItems";
import Link from "next/link";
import { useRouter } from "next/router";
import { logout } from "src/utils/auth";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
    const router = useRouter();

    const isActiveNav = (href: string): boolean => {
        if (href === "/user-host") return router.pathname === href;
        return router.pathname.split("/").includes(href.split("/")[2]);
    };

    return (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="fixed inset-0 z-40 flex lg:hidden"
                    open={sidebarOpen}
                    onClose={setSidebarOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-gray-800">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="absolute top-0 right-0 pt-2 -mr-12">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="sr-only">
                                            Close sidebar
                                        </span>
                                        <XIcon
                                            className="w-6 h-6 text-white"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            </Transition.Child>
                            <div className="flex items-center flex-shrink-0 px-4">
                                <img
                                    className="w-auto h-8"
                                    src="https://tailwindui.com/img/logos/workflow-logo-rose-500-mark-white-text.svg"
                                    alt="Workflow"
                                />
                            </div>
                            <div className="flex-1 h-0 mt-5 overflow-y-auto">
                                <nav className="px-2">
                                    <div className="space-y-1">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                            >
                                                <a
                                                    className={classNames(
                                                        isActiveNav(item.href)
                                                            ? "bg-gray-900 text-white"
                                                            : "text-green-100 hover:bg-gray-700 hover:text-white",
                                                        "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                                                    )}
                                                    aria-current={
                                                        isActiveNav(item.href)
                                                            ? "page"
                                                            : undefined
                                                    }
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            isActiveNav(
                                                                item.href
                                                            )
                                                                ? "text-green-300"
                                                                : "text-green-400 group-hover:text-green-100",
                                                            "mr-4 flex-shrink-0 h-6 w-6"
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </a>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-10">
                                        <p className="px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                            Other useful links
                                        </p>
                                        <div className="mt-2 space-y-1">
                                            {/* {projects.map((project) => ( */}
                                            <button
                                                className="flex items-center px-2 py-2 text-base font-medium text-green-100 rounded-md hover:bg-gray-700 hover:text-white"
                                            >
                                                <span className="truncate">
                                                    Logout
                                                </span>
                                            </button>
                                            {/* ))} */}
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </Transition.Child>
                    <div className="flex-shrink-0 w-14" aria-hidden="true">
                        {/* Dummy element to force sidebar to shrink to fit close icon */}
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex flex-col flex-1 h-0">
                        <div className="flex items-center flex-shrink-0 h-16 px-4 bg-primaryDark">
                            <Logo variant="dark" />
                        </div>
                        <div className="flex flex-col flex-1 overflow-y-auto">
                            <nav className="flex-1 px-2 py-4 bg-primary">
                                <div className="space-y-1">
                                    {navigation.map((item) => (
                                        <Link key={item.name} href={item.href}>
                                            <a
                                                className={classNames(
                                                    isActiveNav(item.href)
                                                        ? "bg-primaryDark text-white"
                                                        : "text-gray-100 hover:bg-primaryHover hover:text-white",
                                                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                )}
                                                aria-current={
                                                    isActiveNav(item.href)
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                <item.icon
                                                    className={classNames(
                                                        isActiveNav(item.href)
                                                            ? "text-green-100"
                                                            : "text-green-100 group-hover:text-green-50",
                                                        "mr-3 flex-shrink-0 h-6 w-6"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-10">
                                    <p className="px-3 text-xs font-semibold tracking-wider text-green-100 uppercase">
                                        Other useful links
                                    </p>
                                    <div className="mt-2 space-y-1">
                                        {/* {projects.map((project) => ( */}
                                        <button
                                            className="flex items-center w-full px-2 py-2 text-base font-medium text-green-300 rounded-md hover:text-white"
                                            onClick={logout}
                                        >
                                            <span className="truncate">
                                                Logout
                                            </span>
                                        </button>
                                        {/* ))} */}
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideBar;
