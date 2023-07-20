import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon, SearchIcon } from "@heroicons/react/outline";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Button, Logo } from "@element";
import { authorizeRole, classNames } from "src/utils/";
import React, { Fragment, useState } from "react";
import { signOut } from "next-auth/react";
import { SearchBoxNew } from "@comp";

interface INavLinkItems {
    name: string;
    link: string;
    authenticate?: boolean;
}

const navLinkItems: INavLinkItems[] = [
    {
        name: "スペース掲載",
        link: "/auth/host-register",
        authenticate: true,
    },
    {
        name: "ログイン",
        link: "/auth/login",
        authenticate: true,
    },
];

const userNavigation = [
    { name: "ダッシュボード", href: "/admin", role: ["admin"] },
    { name: "ダッシュボード", href: "/host", role: ["host"] },
    { name: "プロフィール", href: "/user/profile", role: ["user"] },
    { name: "予約", href: "/user/reservation", role: ["user"] },
    { name: "メッセージ", href: "/messages", role: ["user", "host"] },
    { name: "サブスクリプション", href: "/user/subscriptions", role: ["user"] },
    {
        name: "設定",
        href: "/user/settings",
        role: ["user", "host", "admin"],
    },
];

const NavLink = ({ link, name }: INavLinkItems) => {
    const router = useRouter();
    return (
        <Link href={link}>
            <a
                className={clsx(
                    "inline-flex items-center px-1 pt-1 text-sm border-b-2",
                    {
                        "text-white border-transparent hover:border-gray-100 hover:text-gray-100":
                            router.pathname !== link,
                        "border-gray-100 text-gray-100 hover:text-gray-100":
                            router.pathname === link,
                    }
                )}
            >
                {name}
            </a>
        </Link>
    );
};

const NavLinkOnSmall = ({ link, name }: INavLinkItems) => {
    const router = useRouter();
    return (
        <Link href={link}>
            <a
                className={clsx(
                    "block py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6",
                    {
                        "border-transparent text-white hover:bg-gray-200 hover:border-gray-300 hover:text-gray-500":
                            router.pathname !== link,
                        "bg-gray-200 border-gray-200 text-gray-500":
                            router.pathname === link,
                    }
                )}
            >
                {name}
            </a>
        </Link>
    );
};

const Header = ({ userSession }) => {
    const [showSearch, setShowSearch] = useState(false);

    const router = useRouter();
    const { pathname } = router;

    let isLoggedIn = false;
    let profile;
    let currentUser;
    let profilePhoto;

    if (userSession) {
        profile = userSession.user;
        isLoggedIn = true;
        currentUser = profile.name;
        if (profile.profilePhoto) {
            profilePhoto = profile.profilePhoto.thumbnail?.url;
        } else {
            profilePhoto = `https://avatars.dicebear.com/api/identicon/${profile.id}.svg`;
        }
    }

    return (
        <Disclosure
            as="nav"
            className="fixed top-0 left-0 z-50 w-full bg-primary"
        >
            {({ open }) => (
                <>
                    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex z-20">
                                <div className="flex items-center mr-2 -ml-2 md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="inline-flex items-center justify-center p-2 text-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">
                                            Open main menu
                                        </span>
                                        {open ? (
                                            <XIcon
                                                className="block w-6 h-6"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <MenuIcon
                                                className="block w-6 h-6"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <Link href="/">
                                    <a className="flex items-center flex-shrink-0">
                                        {/* <ClockIcon className="w-8 h-8 text-white" />
                                        <span className="hidden w-auto ml-2 text-lg font-medium text-white h-7 lg:flex lg:items-center">
                                           {config.appName}
                                        </span> */}
                                        <Logo size="default" variant="dark" />
                                    </a>
                                </Link>
                            </div>
                            {pathname !== "/main" && pathname !== "/search" && (
                                <div className="hidden sm:block absolute w-full top-3 left-1/2 transform -translate-x-1/2 text-center">
                                    <button
                                        className="inline-flex items-center px-5 py-2 rounded-full text-white justify-center font-bold bg-primaryHover"
                                        onClick={() => {
                                            setShowSearch(!showSearch);
                                        }}
                                    >
                                        <SearchIcon className="w-5 h-5 mr-2" />
                                        新しい検索
                                    </button>
                                    {showSearch && (
                                        <div className="mt-3 pt-3 pb-5 bg-primaryHover shadow-lg">
                                            <SearchBoxNew type="primary" />
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="flex items-center z-20">
                                <div className="hidden h-full md:mr-6 md:flex md:space-x-8">
                                    {navLinkItems.map(
                                        (
                                            item: INavLinkItems,
                                            index: number
                                        ) => {
                                            {
                                                if (
                                                    isLoggedIn &&
                                                    item.authenticate
                                                ) {
                                                    return null;
                                                } else {
                                                    return (
                                                        <NavLink
                                                            key={index.toString()}
                                                            link={item.link}
                                                            name={item.name}
                                                        />
                                                    );
                                                }
                                            }
                                        }
                                    )}
                                </div>
                                <div className="flex-shrink-0">
                                    {/* Profile dropdown */}
                                    {isLoggedIn && (
                                        <Menu
                                            as="div"
                                            className="relative ml- 8"
                                        >
                                            <div>
                                                <Menu.Button className="flex items-center p-1 text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white">
                                                    <span className="sr-only">
                                                        Open user menu
                                                    </span>
                                                    <img
                                                        className="w-8 h-8 mr-0 sm:mr-2 rounded-full"
                                                        src={profilePhoto}
                                                        alt={currentUser}
                                                    />
                                                    <div className="hidden mr-0 sm:inline-block sm:mr-2 font-medium text-primary">
                                                        {currentUser}
                                                    </div>
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {userNavigation.map(
                                                        (item) => {
                                                            if (
                                                                authorizeRole(
                                                                    profile.roles,
                                                                    item.role
                                                                )
                                                            ) {
                                                                return (
                                                                    <Menu.Item
                                                                        key={
                                                                            item.name
                                                                        }
                                                                    >
                                                                        {({
                                                                            active,
                                                                        }) => (
                                                                            <a
                                                                                href={
                                                                                    item.href
                                                                                }
                                                                                className={classNames(
                                                                                    active
                                                                                        ? "bg-gray-100 text-primary"
                                                                                        : "",
                                                                                    "font-bold block px-4 py-2 text-sm text-gray-500 hover:text-primary"
                                                                                )}
                                                                            >
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </a>
                                                                        )}
                                                                    </Menu.Item>
                                                                );
                                                            } else {
                                                                return null;
                                                            }
                                                        }
                                                    )}
                                                    <button
                                                        className="font-bold block w-full px-4 py-2 text-sm text-left text-gray-500 hover:bg-gray-100 hover:text-primary"
                                                        onClick={async (
                                                            event
                                                        ) => {
                                                            event.preventDefault();
                                                            await signOut();
                                                        }}
                                                    >
                                                        サインアウト
                                                    </button>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    )}
                                    {!isLoggedIn && (
                                        <Button
                                            variant="white"
                                            rounded
                                            className="font-light text-gray-500"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                router.push("/auth/register");
                                            }}
                                        >
                                            新規登録
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="md:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            {navLinkItems.map(
                                (item: INavLinkItems, index: number) => (
                                    <div key={`${index.toString()}`}>
                                        {isLoggedIn &&
                                        item.authenticate ? null : (
                                            <NavLinkOnSmall
                                                key={item.link}
                                                name={item.name}
                                                link={item.link}
                                            />
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default Header;
