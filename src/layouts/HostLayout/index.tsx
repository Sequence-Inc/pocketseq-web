
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
    ArchiveIcon,
    ClockIcon,
    HomeIcon,
    MenuAlt2Icon,
    UserCircleIcon as UserCircleIconOutline,
    ViewListIcon,
    XIcon,
} from '@heroicons/react/outline'
import {
    BellIcon,
    CalendarIcon,
    ChatAltIcon,
    CheckCircleIcon,
    LockOpenIcon,
    PencilIcon,
    SearchIcon,
    TagIcon,
    UserCircleIcon as UserCircleIconSolid,
} from '@heroicons/react/solid'
import SideBar from 'src/layouts/SideBar'
import Toolbar from '../Toolbar'


const navigation = [
    { name: 'All Issues', href: '#', icon: HomeIcon, current: true },
    { name: 'My Issues', href: '#', icon: ViewListIcon, current: false },
    { name: 'Assigned', href: '#', icon: UserCircleIconOutline, current: false },
    { name: 'Closed', href: '#', icon: ArchiveIcon, current: false },
    { name: 'Recent', href: '#', icon: ClockIcon, current: false },
]
const projects = [
    { id: 1, name: 'GraphQL API', href: '#' },
    { id: 2, name: 'iOS App', href: '#' },
    { id: 3, name: 'Marketing Site Redesign', href: '#' },
    { id: 4, name: 'Customer Portal', href: '#' },
]
const activity = [
    {
        id: 1,
        type: 'comment',
        person: { name: 'Eduardo Benz', href: '#' },
        imageUrl:
            'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ',
        date: '6d ago',
    },
    {
        id: 2,
        type: 'assignment',
        person: { name: 'Hilary Mahy', href: '#' },
        assigned: { name: 'Kristin Watson', href: '#' },
        date: '2d ago',
    },
    {
        id: 3,
        type: 'tags',
        person: { name: 'Hilary Mahy', href: '#' },
        tags: [
            { name: 'Bug', href: '#', color: 'bg-rose-500' },
            { name: 'Accessibility', href: '#', color: 'bg-indigo-500' },
        ],
        date: '6h ago',
    },
    {
        id: 4,
        type: 'comment',
        person: { name: 'Jason Meyers', href: '#' },
        imageUrl:
            'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.',
        date: '2h ago',
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function HostLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                <Toolbar setSidebarOpen={setSidebarOpen} />
                <main className="relative flex-1 overflow-y-auto bg-gray-100 focus:outline-none">
                    {children}
                </main>
            </div>
        </div>
    )
}

