
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

