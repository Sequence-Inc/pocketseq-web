import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon, ClockIcon } from "@heroicons/react/outline";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Button } from "@element";
import { GET_SESSION } from "src/apollo/queries/state.queries";
import { useQuery } from '@apollo/client';
import { isAuthenticated, logout } from "src/utils/auth";
import React, { Fragment } from "react";

interface INavLinkItems {
    name: string;
    link: string;
    authenticate?: boolean;
}

const navLinkItems: INavLinkItems[] = [
    {
        name: "スペース掲載",
        link: "/space"
    },
    {
        name: "初めての方へ",
        link: "/guide"
    },
    {
        name: "ヘルプ",
        link: "/help"
    },
    {
        name: "ログイン",
        link: "/auth/login",
        authenticate: true
    },
];

const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
]

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

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
                        "border-gray-100 text-gray-100":
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

const Header = () => {
    const { data } = useQuery(GET_SESSION)
    const router = useRouter();
    return (
        <Disclosure
            as="nav"
            className="fixed top-0 left-0 z-20 w-full bg-primary"
        >
            {({ open }) => (
                <>
                    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">{console.log("STATE_________", data)}
                        <div className="flex justify-between h-16">
                            <div className="flex">
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
                                        <ClockIcon className="w-8 h-8 text-white" />
                                        <span className="hidden w-auto ml-2 text-lg font-medium text-white h-7 lg:flex lg:items-center">
                                            Time Book
                                        </span>
                                    </a>
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <div className="hidden h-full md:mr-6 md:flex md:space-x-8">
                                    {navLinkItems.map((item: INavLinkItems) => (
                                        <>
                                            {isAuthenticated() && item.authenticate ? null :
                                                <NavLink
                                                    key={item.link}
                                                    link={item.link}
                                                    name={item.name}
                                                />
                                            }
                                        </>
                                    ))}
                                </div>
                                <div className="flex-shrink-0">
                                    {/* Profile dropdown */}
                                    {isAuthenticated() &&
                                        <Menu as="div" className="relative ml-8">
                                            <div>
                                                <Menu.Button className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                    <span className="sr-only">Open user menu</span>
                                                    <img className="w-8 h-8 rounded-full" src={user.imageUrl} alt="" />
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
                                                    {userNavigation.map((item) => (
                                                        <Menu.Item key={item.name}>
                                                            {({ active }) => (
                                                                <a
                                                                    href={item.href}
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100' : '',
                                                                        'block px-4 py-2 text-sm text-gray-700'
                                                                    )}
                                                                >
                                                                    {item.name}
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    ))}
                                                    <button
                                                        className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100'
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            logout();
                                                        }}
                                                    >
                                                        サインアウト
                                                    </button>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    }
                                    {!isAuthenticated() &&
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
                                        </Button>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="md:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            {navLinkItems.map((item: INavLinkItems) => (
                                <>
                                    {isAuthenticated() && item.authenticate ? null :
                                        <NavLinkOnSmall
                                            key={item.link}
                                            name={item.name}
                                            link={item.link}
                                        />}
                                </>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default Header;
