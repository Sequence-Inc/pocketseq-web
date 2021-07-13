import { Button } from '@element'
import { PhotographIcon } from '@heroicons/react/outline'
import React from 'react'

export const SpaceInfoBanner = () => {
    return (
        <div className="relative pt-8 mb-8">
            <div className="relative w-full overflow-hidden rounded-lg aspect-w-16 aspect-h-8 lg:aspect-h-6">
                <img
                    src="https://cdnspacemarket.com/uploads/attachments/776274/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c"
                    alt="category items"
                    className="object-cover w-full h-full"
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
    )
}
