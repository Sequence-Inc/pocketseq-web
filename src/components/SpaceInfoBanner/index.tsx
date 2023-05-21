import { Button } from "@element";
import { PhotographIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { IPhoto } from "src/types/timebookTypes";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export const SpaceInfoBanner = ({ photos }: { photos: IPhoto[] }) => {
    const [open, setOpen] = React.useState(false);

    // default photo
    const mainPhoto = photos?.find((photo) => photo.isDefault);
    const photo = mainPhoto || photos[photos.length - 1];

    const slides = mainPhoto
        ? [mainPhoto, ...photos.filter((photo) => photo.id !== mainPhoto.id)]
        : photos;

    return (
        <div className="relative pt-4 mb-8">
            <div className="relative w-full overflow-hidden rounded-lg aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                    src={photo.large.url}
                    alt="category items"
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
                <Button variant="white" onClick={() => setOpen(true)}>
                    <PhotographIcon className="inline-block w-4 h-4 mr-1 text-gray-600" />
                    <span className="hidden sm:inline">すべての写真を表示</span>
                </Button>
            </div>
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={slides.map((photo) => {
                    return { src: photo.large.url };
                })}
            />
        </div>
    );
};
