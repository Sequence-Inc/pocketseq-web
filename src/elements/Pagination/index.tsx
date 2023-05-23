import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { paginationTruncate } from "src/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    changePage: (pageNumber: number) => void;
}

const Pagination = ({
    currentPage,
    totalPages,
    changePage,
}: PaginationProps) => {
    return (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
                <button
                    className={clsx(
                        "relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium rounded-md hover:bg-gray-50",
                        {
                            "text-gray-400": currentPage <= totalPages,
                            "text-gray-700": currentPage >= totalPages,
                        }
                    )}
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage <= totalPages}
                >
                    Previous
                </button>
                <button
                    className={clsx(
                        "relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium rounded-md hover:bg-gray-50",
                        {
                            "text-gray-400": currentPage >= totalPages,
                            "text-gray-700": currentPage <= totalPages,
                        }
                    )}
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to{" "}
                        <span className="font-medium">10</span> of{" "}
                        <span className="font-medium">97</span> results
                    </div>
                </div>
                <div>
                    <nav
                        className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                    >
                        <button
                            className={clsx(
                                "relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-l-md hover:bg-gray-50",
                                {
                                    "text-gray-300": currentPage <= totalPages,
                                    "text-gray-500": currentPage >= totalPages,
                                }
                            )}
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage <= totalPages}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                            />
                        </button>
                        {paginationTruncate(currentPage, totalPages).map(
                            (page, index) => (
                                <button
                                    key={page + index}
                                    aria-current="page"
                                    className={clsx(
                                        "focus:outline-none relative z-10 inline-flex items-center px-4 py-2 text-sm font-medium pagination",
                                        {
                                            "text-primary":
                                                page === currentPage,
                                            "text-gray-500":
                                                page !== currentPage,
                                        }
                                    )}
                                    onClick={() =>
                                        page !== "..." && changePage(page)
                                    }
                                >
                                    {page}
                                </button>
                            )
                        )}
                        <button
                            className={clsx(
                                "relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-l-md hover:bg-gray-50",
                                {
                                    "text-gray-300": currentPage >= totalPages,
                                    "text-gray-500": currentPage <= totalPages,
                                }
                            )}
                            disabled={currentPage >= totalPages}
                            onClick={() => changePage(currentPage + 1)}
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                            />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
