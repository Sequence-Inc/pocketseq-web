import { Button } from "@element";
import { PhotographIcon } from "@heroicons/react/outline";
import React from "react";
import { IPhoto } from "src/types/timebookTypes";

export const SpaceInfoBanner = ({ photos }: { photos: IPhoto[] }) => {
    return (
        <div className="relative pt-4 mb-8">
            <div className="relative w-full overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                {/* <img
                    src={photos[0].large.url}
                    alt="category items"
                    className="object-cover w-full h-full"
                /> */}
                <img
                    src="https://a0.muscache.com/im/pictures/7c586cfa-6a5c-4ec1-8fcd-5890b6a50769.jpg?im_w=720"
                    alt="category items"
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
                <Button variant="white">
                    <PhotographIcon className="inline-block w-4 h-4 mr-1 text-gray-600" />
                    <span className="hidden sm:inline">すべての写真を表示</span>
                </Button>
            </div>
        </div>
    );
};
