import {
    ArchiveIcon,
    ClockIcon,
    HomeIcon,
    UserCircleIcon as UserCircleIconOutline,
    ViewListIcon,
} from '@heroicons/react/outline'

export const navigation = [
    { name: 'Dashboard', href: '/user-host', icon: HomeIcon },
    { name: 'My Spaces', href: '/user-host/my-space', icon: ViewListIcon },
    { name: 'Assigned', href: '/user-host/s', icon: UserCircleIconOutline },
    { name: 'Closed', href: '/user-host/s', icon: ArchiveIcon },
    { name: 'Recent', href: '/user-host/s', icon: ClockIcon },
]
export const projects = [
    { id: 1, name: 'GraphQL API', href: '/user-host' },
    { id: 2, name: 'iOS App', href: '/user-host' },
    { id: 3, name: 'Marketing Site Redesign', href: '/user-host' },
    { id: 4, name: 'Customer Portal', href: '/user-host' },
]