import React from 'react'

const NearestStation = () => {
    return (
        <form>
            <input placeholder="nearest station" />
            {/* <div className="flex items-center justify-between px-4 py-2 border-t border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
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
                                    <Button type="button" variant="white" onClick={() => { stationsPrepend(defaultStationObj) }}>
                                        <PlusIcon className="w-5 h-5 mr-2 text-inherit" />Add Station
                                    </Button>
                                </div>
                            </div>
                            {stationsField.map((field: any, index: number) => (
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
        </form>
    )
}

export default NearestStation
