import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon, LogoutIcon } from "@heroicons/react/outline";
import { Logo } from "@element";
import { navigation } from "./menuItems";
import Link from "next/link";
import { useRouter } from "next/router";
import { logout, classNames, authorizeRole } from "src/utils/";
import { signOut } from "next-auth/react";

const SideBar = ({ userSession, sidebarOpen, setSidebarOpen }) => {
    const router = useRouter();

    const isActiveNav = (href: string): boolean => {
        if (href === "/host") return router.pathname === href;
        return router.pathname.split("/").includes(href.split("/")[2]);
    };

    const renderMenuItem = ({ name, href, Icon, roles }, index) => {
        if (!authorizeRole(userSession.user.roles, roles)) return null;
        return (
            <Link key={index} href={href}>
                <a
                    className={classNames(
                        isActiveNav(href)
                            ? "bg-primaryDark text-white hover:text-green-50"
                            : "text-gray-100 hover:bg-primaryHover hover:text-white",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                    aria-current={isActiveNav(href) ? "page" : undefined}
                >
                    <Icon
                        className={classNames(
                            isActiveNav(href)
                                ? "text-green-100"
                                : "text-green-100 group-hover:text-green-50",
                            "mr-3 flex-shrink-0 h-6 w-6"
                        )}
                        aria-hidden="true"
                    />
                    {name}
                </a>
            </Link>
        );
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
                        <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-primary">
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
                                <Logo variant="dark" />
                            </div>
                            <div className="flex-1 h-0 mt-5 overflow-y-auto">
                                <nav className="px-2">
                                    <div className="space-y-1">
                                        {navigation.map((item, index) =>
                                            renderMenuItem(item, index)
                                        )}
                                    </div>
                                    <div className="mt-10">
                                        <div className="mt-2 space-y-1">
                                            <button
                                                className="flex items-center w-full px-2 py-2 text-base font-medium text-green-100 rounded-md hover:text-white"
                                                onClick={async () => {
                                                    await signOut();
                                                }}
                                            >
                                                <LogoutIcon className="w-6 h-6 mr-3" />
                                                <span className="truncate">
                                                    ログアウト
                                                </span>
                                            </button>
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
                                    {navigation.map((item, index) =>
                                        renderMenuItem(item, index)
                                    )}
                                </div>
                                <div className="mt-10">
                                    <div className="mt-2 space-y-1">
                                        <button
                                            className="flex items-center w-full px-2 py-2 text-base font-medium text-green-100 rounded-md hover:text-white"
                                            onClick={async () => {
                                                await signOut();
                                            }}
                                        >
                                            <LogoutIcon className="w-6 h-6 mr-3" />
                                            <span className="truncate">
                                                ログアウト
                                            </span>
                                        </button>
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
