import { FloatingPrice } from '@comp'
import { Button, Container, Tag } from '@element';
import React from 'react'
import Image from "next/image";
import { LocationMarkerIcon, PhotographIcon } from '@heroicons/react/outline';

const SpaceDetail = () => {
    return (
        <Container>
            <div className="relative">
                <div className="relative w-full my-10 overflow-hidden rounded-lg aspect-w-16 aspect-h-8 lg:aspect-h-6">
                    <Image
                        src="https://cdnspacemarket.com/uploads/attachments/776274/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c"
                        alt="category items"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                    />
                </div>
                <div className="absolute bottom-2 right-2">
                    <Button variant="white">
                        <PhotographIcon className="inline-block w-4 h-4 mr-1" />
                        <span>すべての写真を表示</span>
                    </Button>
                </div>
            </div>
            <div className="flex space-x-12">
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
                <FloatingPrice />
            </div>
        </Container >
    )
}

export default SpaceDetail;
