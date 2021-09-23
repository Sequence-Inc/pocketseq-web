import { Button, Container, Select, TextField } from "@element";
import React from "react";
import HostLayout from "src/layouts/HostLayout";
import Link from "next/link";
import useAddSpace from "@hooks/useAddSpace";
import { Controller } from "react-hook-form";
import ConfirmModal from "src/elements/ConfirmModal";
import HostPricing from "src/components/HostPricing";
import HostStation from "src/components/HostStation";
import HostSpace from "src/components/HostSpace";
import { PlusIcon } from "@heroicons/react/solid";
import { Disclosure, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { NearestStation } from "src/components/NearestStation";
import Head from "next/head";

const AddNewSpace = () => {
    const {
        register,
        control,
        watch,
        errors,
        onSubmit,
        loading,
        confirmRef,
        fields,
        prepend,
        remove,
        stationsField,
        stationsPrepend,
        stationsRemove,
        defaultPriceObj,
        defaultStationObj,
    } = useAddSpace();
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeStationIndex, setActiveStationIndex] = useState(0);

    return (
        <HostLayout>
            <Head>
                <title>Add Space</title>
            </Head>
            <ConfirmModal ref={confirmRef} redirect="/host/my-space" />
            <Container className="py-4 sm:py-6 lg:py-8">
                <form onSubmit={onSubmit}>
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="space-y-4 bg-white">
                            <div>
                                <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Space
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        This information will be displayed
                                        publicly so be sure to add valid
                                        information.
                                    </p>
                                </div>

                                <div className="px-4 py-2 space-y-4 sm:px-6 sm:py-6">
                                    <HostSpace
                                        register={register}
                                        control={control}
                                        errors={errors}
                                        loading={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between px-4 py-2 border-t border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                                    <div>
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                            Pricing
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Added a pricing plan for your space
                                        </p>
                                    </div>
                                    <div className="float-right">
                                        <Button
                                            type="button"
                                            variant="white"
                                            onClick={() => {
                                                prepend(defaultPriceObj);
                                            }}
                                        >
                                            <PlusIcon className="w-5 h-5 mr-2 text-inherit" />
                                            Add Pricing
                                        </Button>
                                    </div>
                                </div>
                                {fields.map((field: any, index: number) => (
                                    <Disclosure key={index}>
                                        {watch().spacePricePlan[index]
                                            .planTitle && (
                                            <Disclosure.Button className="flex w-full px-8 py-3 border-t border-b border-gray-200">
                                                <p
                                                    className="flex-1 text-left"
                                                    onClick={() => {
                                                        setActiveIndex(index);
                                                    }}
                                                >
                                                    {
                                                        watch().spacePricePlan[
                                                            index
                                                        ].planTitle
                                                    }
                                                </p>
                                                <button
                                                    className="p-1 bg-red-500 rounded focus:outline-none"
                                                    onClick={() => {
                                                        remove(index);
                                                    }}
                                                >
                                                    <TrashIcon className="w-4 h-4 text-red-50" />
                                                </button>
                                            </Disclosure.Button>
                                        )}
                                        <Transition
                                            show={activeIndex === index}
                                            enter="transition duration-100 ease-out"
                                            enterFrom="transform scale-95 opacity-0"
                                            enterTo="transform scale-100 opacity-100"
                                            leave="transition duration-75 ease-out"
                                            leaveFrom="transform scale-100 opacity-100"
                                            leaveTo="transform scale-95 opacity-0"
                                        >
                                            <Disclosure.Panel
                                                static
                                                className="px-4 py-2 space-y-4 sm:px-6 sm:py-6"
                                            >
                                                <HostPricing
                                                    field={field}
                                                    index={index}
                                                    register={register}
                                                    errors={errors}
                                                    loading={loading}
                                                />
                                            </Disclosure.Panel>
                                        </Transition>
                                    </Disclosure>
                                ))}
                            </div>

                            <div>
                                <div className="flex items-center justify-between px-4 py-2 border-t border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                                    <div>
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                            Station
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Share the nearest station from your
                                            space.
                                        </p>
                                    </div>
                                    <div className="float-right">
                                        <Button
                                            type="button"
                                            variant="white"
                                            onClick={() => {
                                                stationsPrepend(
                                                    defaultStationObj
                                                );
                                            }}
                                        >
                                            <PlusIcon className="w-5 h-5 mr-2 text-inherit" />
                                            Add Station
                                        </Button>
                                    </div>
                                </div>
                                {/* {stationsField.map((field: any, index: number) => (
                                    <Disclosure key={index}>
                                        {watch().nearestStations[index].stationId !== 0 &&
                                            <Disclosure.Button className="flex w-full px-8 py-3 border-t border-b border-gray-200">
                                                <p className="flex-1 text-left" onClick={() => { setActiveStationIndex(index) }}>{watch().nearestStations[index].stationId}</p>
                                                <button className="p-1 bg-red-500 rounded focus:outline-none" onClick={() => { stationsRemove(index) }}>
                                                    <TrashIcon className="w-4 h-4 text-red-50" />
                                                </button>
                                            </Disclosure.Button>}
                                        <Transition
                                            show={activeStationIndex === index}
                                            enter="transition duration-100 ease-out"
                                            enterFrom="transform scale-95 opacity-0"
                                            enterTo="transform scale-100 opacity-100"
                                            leave="transition duration-75 ease-out"
                                            leaveFrom="transform scale-100 opacity-100"
                                            leaveTo="transform scale-95 opacity-0"
                                        >
                                            <Disclosure.Panel static className="px-4 py-2 space-y-4 sm:px-6 sm:py-6">
                                                <HostStation field={field} index={index} register={register} control={control} errors={errors} loading={loading} />
                                            </Disclosure.Panel>
                                        </Transition>
                                    </Disclosure>
                                ))} */}

                                <div className="px-4 py-2 space-y-4 sm:px-6 sm:py-6">
                                    <NearestStation station={null} />
                                </div>
                            </div>
                        </div>

                        <div className="flex px-4 py-5 space-x-2 bg-gray-50 sm:px-6">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-auto px-8"
                                loading={loading}
                            >
                                Save
                            </Button>
                            <Link href="/host/my-space">
                                <a>
                                    <Button
                                        className="w-auto px-8"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </a>
                            </Link>
                        </div>
                    </div>
                </form>
            </Container>
        </HostLayout>
    );
};

export default AddNewSpace;
