import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    BellIcon,
    ClockIcon,
    CogIcon,
    CreditCardIcon,
    DocumentReportIcon,
    HomeIcon,
    MenuAlt1Icon,
    QuestionMarkCircleIcon,
    ScaleIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    XIcon,
} from '@heroicons/react/outline'
import {
    CashIcon,
    CheckCircleIcon,
    PlusIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    OfficeBuildingIcon,
    SearchIcon,
    ViewListIcon,
} from '@heroicons/react/solid'
import HostLayout from 'src/layouts/HostLayout'
import Head from "next/head";
import { Button, Container } from '@element';
import Link from "next/link";
import { useQuery } from '@apollo/client'
import { MY_SPACES } from 'src/apollo/queries/space.queries'

const navigation = [
    { name: 'Home', href: '#', icon: HomeIcon, current: true },
    { name: 'History', href: '#', icon: ClockIcon, current: false },
    { name: 'Balances', href: '#', icon: ScaleIcon, current: false },
    { name: 'Cards', href: '#', icon: CreditCardIcon, current: false },
    { name: 'Recipients', href: '#', icon: UserGroupIcon, current: false },
    { name: 'Reports', href: '#', icon: DocumentReportIcon, current: false },
]
const secondaryNavigation = [
    { name: 'Settings', href: '#', icon: CogIcon },
    { name: 'Help', href: '#', icon: QuestionMarkCircleIcon },
    { name: 'Privacy', href: '#', icon: ShieldCheckIcon },
]
const cards = [
    { name: 'Account balance', href: '#', icon: ScaleIcon, amount: '$30,659.45' },
    // More items...
]
const transactions = [
    {
        id: 1,
        name: 'Payment to Molly Sanders',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    {
        id: 1,
        name: 'Payment to Molly Sanders',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    {
        id: 1,
        name: 'Payment to Molly Sanders',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    {
        id: 1,
        name: 'Payment to Molly Sanders',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    {
        id: 1,
        name: 'Payment to Molly Sanders',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    {
        id: 1,
        name: 'Payment to Molly Sanders',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    {
        id: 1,
        name: 'Payment to Molly Sanders',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    {
        id: 1,
        name: 'Payment to Molly Sanders',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    {
        id: 1,
        name: 'Payment to Molly Sanders',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    {
        id: 1,
        name: 'Payment to Molly Sanders',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    }
]
const statusStyles = {
    success: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-gray-100 text-gray-800',
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const MySpace = () => {
    const { data } = useQuery(MY_SPACES);

    return (
        <HostLayout>
            <Head>
                <title>My Spaces | Host Admin</title>
            </Head>{console.log(data)}
            {/* Page header */}
            <div className="bg-white shadow">
                <Container>
                    {/* <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8"> */}
                    <div className="py-6 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Profile */}
                            <div className="flex items-center">
                                <div className="hidden w-16 h-16 border rounded-lg shadow-sm sm:flex sm:justify-center sm:items-center">
                                    <ViewListIcon className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <img
                                            className="w-16 h-16 rounded-full sm:hidden"
                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                                            alt=""
                                        />
                                        <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                                            My Spaces
                                        </h1>
                                    </div>
                                    <dl className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                        <dt className="sr-only">Total Spaces</dt>
                                        <dd className="flex items-center text-sm font-medium text-gray-500 capitalize sm:mr-6">
                                            <OfficeBuildingIcon
                                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            10,000
                                        </dd>
                                        <dt className="sr-only">Account status</dt>
                                        <dd className="flex items-center mt-3 text-sm font-medium text-gray-500 capitalize sm:mr-6 sm:mt-0">
                                            <CheckCircleIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" aria-hidden="true" />
                                            12 spaces
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-6 space-x-3 md:mt-0 md:ml-4">
                            {/* <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            >
                                Add money
                            </button> */}
                            {/* <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            >
                                Add new sapce
                            </button> */}
                            <Link href="/user-host/my-space/add">
                                <a>
                                    <Button variant='primary' Icon={PlusIcon}>Add new space</Button>
                                </a>
                            </Link>
                        </div>
                    </div>
                    {/* </div> */}
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8">
                {/* <h2 className="text-lg font-medium leading-6 text-gray-900">
                    List of my spaces
                </h2> */}
                {/* Activity list (smallest breakpoint only) */}
                <div className="shadow sm:hidden">
                    <ul className="mt-2 overflow-hidden divide-y divide-gray-200 shadow sm:hidden">
                        {transactions.map((transaction) => (
                            <li key={transaction.id}>
                                <a href={transaction.href} className="block px-4 py-4 bg-white hover:bg-gray-50">
                                    <span className="flex items-center space-x-4">
                                        <span className="flex flex-1 space-x-2 truncate">
                                            <CashIcon className="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
                                            <span className="flex flex-col text-sm text-gray-500 truncate">
                                                <span className="truncate">{transaction.name}</span>
                                                <span>
                                                    <span className="font-medium text-gray-900">{transaction.amount}</span>{' '}
                                                    {transaction.currency}
                                                </span>
                                                <time dateTime={transaction.datetime}>{transaction.date}</time>
                                            </span>
                                        </span>
                                        <ChevronRightIcon className="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <nav
                        className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200"
                        aria-label="Pagination"
                    >
                        <div className="flex justify-between flex-1">
                            <a
                                href="#"
                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:text-gray-500"
                            >
                                Previous
                            </a>
                            <a
                                href="#"
                                className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:text-gray-500"
                            >
                                Next
                            </a>
                        </div>
                    </nav>
                </div>

                {/* Activity table (small breakpoint and up) */}
                <div className="hidden sm:block">
                    <div className="flex flex-col mt-2">
                        <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                                            Transaction
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase bg-gray-50">
                                            Amount
                                        </th>
                                        <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50 md:block">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase bg-gray-50">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} className="bg-white">
                                            <td className="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap">
                                                <div className="flex">
                                                    <a href={transaction.href} className="inline-flex space-x-2 text-sm truncate group">
                                                        <CashIcon
                                                            className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                                                            aria-hidden="true"
                                                        />
                                                        <p className="text-gray-500 truncate group-hover:text-gray-900">{transaction.name}</p>
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                                                <span className="font-medium text-gray-900">{transaction.amount} </span>
                                                {transaction.currency}
                                            </td>
                                            <td className="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block">
                                                <span
                                                    className={classNames(
                                                        statusStyles[transaction.status],
                                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                                                    )}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                                                <time dateTime={transaction.datetime}>{transaction.date}</time>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            <nav
                                className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
                                aria-label="Pagination"
                            >
                                <div className="hidden sm:block">
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                                        <span className="font-medium">20</span> results
                                    </p>
                                </div>
                                <div className="flex justify-between flex-1 sm:justify-end">
                                    <a
                                        href="#"
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Previous
                                    </a>
                                    <a
                                        href="#"
                                        className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Next
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </Container>
        </HostLayout>
    )
}

export default MySpace
