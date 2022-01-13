import { ItemGrid } from "@comp";
import { Container } from "@element";
import { ChevronRightIcon } from "@heroicons/react/solid";
import { itemGridData } from "@page/index";
import React from "react";

export const SpaceInfoRecommended = () => {
    return (
        <div className="py-8 mt-16 bg-gray-100">
            <Container>
                <div className="flex items-center justify-between px-1 pb-3 mb-4 border-b border-gray-200">
                    <p className="text-xl text-gray-800">宿泊先をもっと見る</p>
                    <a
                        href="#"
                        className="flex items-center text-xs text-gray-500 hover:text-primary"
                    >
                        もっと見る
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </a>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* {itemGridData.map((item, index) => (
                        <ItemGrid key={index} data={item} />
                    ))} */}
                </div>
            </Container>
        </div>
    );
};
