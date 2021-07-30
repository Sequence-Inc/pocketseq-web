import {
    MenuAlt2Icon
} from '@heroicons/react/outline';
import {
    SearchIcon
} from '@heroicons/react/solid';

const Toolbar = ({ setSidebarOpen }) => {
    return (
        <div className="relative z-10 flex flex-shrink-0 h-16 bg-white border-b border-gray-200">
            <button
                type="button"
                className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 lg:hidden"
                onClick={() => setSidebarOpen(true)}
            >
                <span className="sr-only">Open sidebar</span>
                <MenuAlt2Icon className="w-6 h-6" aria-hidden="true" />
            </button>
            <div className="flex justify-between flex-1 px-4">
                <div className="flex flex-1">
                    <form className="flex w-full lg:ml-0" action="#" method="GET">
                        <label htmlFor="search-field" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5" aria-hidden="true" />
                            </div>
                            <input
                                id="search-field"
                                className="block w-full h-full py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 border-transparent focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                                placeholder="Search"
                                type="search"
                                name="search"
                            />
                        </div>
                    </form>
                </div>
                <div className="flex items-center ml-4 lg:ml-6">
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toolbar;