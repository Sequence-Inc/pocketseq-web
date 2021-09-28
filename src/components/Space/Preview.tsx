import { PaperClipIcon } from '@heroicons/react/solid'
import { Button } from "@element";
import router from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_SPACE_BY_ID } from 'src/apollo/queries/space.queries';

export default function Preview({ activeStep, setActiveStep, steps, spaceId }) {
    const { data } = useQuery(GET_SPACE_BY_ID, { variables: { id: spaceId } });

    const hasPrevious: boolean = activeStep > 0 && true;
    const hasNext: boolean = activeStep < steps.length - 1 && true;

    const handlePrevious = (): void => {
        if (hasPrevious) setActiveStep(activeStep - 1);
    };

    return (
        <>
            <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Preview
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    This information will be displayed publicly so be sure to
                    add valid information.
                </p>
            </div>
            <div className="px-4 sm:p-0">
                <dl className="">
                    <div className="py-4 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Space Name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data?.spaceById?.name}</dd>
                    </div>
                    <div className="py-4 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Maximum Capacity</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data?.spaceById?.maximumCapacity} people</dd>
                    </div>
                    <div className="py-4 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Space Size</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data?.spaceById?.spaceSize} sq. meter</dd>
                    </div>
                    <div className="py-4 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Zip Code</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data?.spaceById?.address?.postalCode}</dd>
                    </div>
                    <div className="py-4 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Prefecture</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data?.spaceById?.address?.prefecture?.name}</dd>
                    </div>
                    <div className="py-4 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">City</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data?.spaceById?.address?.city}</dd>
                    </div>
                    <div className="py-4 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Address Line 1</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data?.spaceById?.address?.addressLine1}</dd>
                    </div>
                    <div className="py-4 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Address Line 2</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data?.spaceById?.address?.addressLine2}</dd>
                    </div>
                    {/* Nearest Stations */}
                    <div className="py-4 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Train Stations</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <ul role="list" className="border border-gray-200 divide-y divide-gray-200 rounded-md">
                                {data?.spaceById?.nearestStations.map(station => (
                                    <li className="py-3 pl-3 pr-4 text-sm">
                                        <div className="flex">
                                            <PaperClipIcon className="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
                                            <div>
                                                <p className="ml-2 truncate">{station.station.stationName}</p>
                                                <p className="ml-2 text-xs font-medium text-gray-400 truncate">@{station.via}, {station.time} minutes</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </dd>
                    </div>
                    {/* Price Plan */}
                    <div className="py-4 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Pricing Plans</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <ul role="list" className="border border-gray-200 divide-y divide-gray-200 rounded-md">
                                {data?.spaceById?.spacePricePlans.map(price => (
                                    <li className="py-3 pl-3 pr-4 text-sm">
                                        <div className="flex">
                                            <PaperClipIcon className="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
                                            <div>
                                                <p className="ml-2 truncate">{price.title}</p>
                                                <p className="ml-2 text-xs font-medium text-gray-400 truncate">{price.type}, {price.amount} yen</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </dd>
                    </div>
                </dl>
            </div>
            <div className="flex justify-between px-4 py-5 bg-gray-50 sm:px-6">
                <Button
                    className="w-auto px-8"
                    onClick={handlePrevious}
                >
                    previous
                </Button>
                <Button
                    variant="primary"
                    className="w-auto px-8"
                    onClick={() => router.push('/host/my-space')}
                >
                    Create Space
                </Button>
            </div>
        </>
    )
}
