import { FloatingPrice } from "@comp";
import { Button, Container, Tag } from "@element";
import React from "react";
import { LocationMarkerIcon, PhotographIcon } from "@heroicons/react/outline";
import { MainLayout } from "@layout";

const SpaceDetail = () => {
    return (
        <MainLayout>
            <div className="relative pt-8 mb-8">
                <div className="relative w-full overflow-hidden rounded-lg aspect-w-16 aspect-h-8 lg:aspect-h-6">
                    <img
                        src="https://cdnspacemarket.com/uploads/attachments/776274/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c"
                        alt="category items"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
                    <Button variant="white">
                        <PhotographIcon className="inline-block w-4 h-4 mr-1 text-gray-600" />
                        <span className="hidden sm:inline">
                            すべての写真を表示
                        </span>
                    </Button>
                </div>
            </div>
            <div className="relative flex space-x-12">
                <div className="flex-1">
                    <div className="mb-3">
                        <Tag
                            Icon={LocationMarkerIcon}
                            iconStyle="text-gray-300"
                            textStyle="text-sm text-gray-500"
                            numberOfLines={1}
                        >
                            大阪府大阪市天王寺区
                        </Tag>
                    </div>
                </div>
                <div className="hidden md:block">
                    <FloatingPrice />
                </div>
            </div>
        </MainLayout>
    );
};

export default SpaceDetail;
