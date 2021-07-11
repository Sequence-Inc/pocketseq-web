import { GridViewSearch, ListViewSearch, SearchBox } from '@comp'
import { Alert, GoogleMap, Pill, Select } from '@element'
import { LightBulbIcon, SpeakerphoneIcon, ViewGridAddIcon, ViewListIcon } from '@heroicons/react/outline'
import { MainLayout } from '@layout'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'
import { itemGridData } from '..'

const mapOptions = { center: { lat: 34.6619, lng: 135.5205 }, zoom: 13 } as google.maps.MapOptions

const Search = () => {
    const [filter, setFilter] = useState<string>("おすすめ");
    const [sort, setSort] = useState<'list' | 'grid'>("list");

    return (
        <MainLayout>
            <div className="relative grid grid-cols-1 lg:grid-cols-8">
                <div className="col-span-5 px-6 py-10 mt-16">
                    <div className="flex justify-center">
                        <SearchBox />
                    </div>
                    <div className="pt-10">
                        <p className="text-gray-500">300+ 件</p>
                        <h1 className="mb-6 text-3xl font-bold text-gray-700">新宿駅近くのレンタルスペース</h1>
                        <div className="space-y-8">
                            {/* pill section */}
                            <div>
                                <Pill>料金</Pill>
                                <Pill>会場タイプ</Pill>
                                <Pill>人数</Pill>
                                <Pill>詳細条件</Pill>
                            </div>

                            {/* alert section */}
                            <div className="space-y-0.5">
                                <Alert Icon={SpeakerphoneIcon}>
                                    <p>
                                        We are currently suspending all new bookings for the Go To Travel Campaign. We will update the details on our FAQ page as needed.
                                        <Link href="/">
                                            <a className="font-medium">
                                                {" "}Go To Travel Campaign FAQ
                                            </a>
                                        </Link>
                                    </p>
                                </Alert>
                                <Alert Icon={LightBulbIcon}>
                                    <p className="font-medium">正確な料金を表示するために</p>
                                    <p className="text-sm">利用日と時間を設定すると、正確な合計金額が表示されます。</p>
                                </Alert>
                            </div>

                            {/* view changer button */}
                            <div className="flex justify-between">
                                <div className="flex border border-gray-200 rounded-md">
                                    <button className="p-2.5 border-r border-gray-200 focus:outline-none" onClick={() => { setSort('list') }}>
                                        <ViewListIcon className="w-5 h-5 text-gray-400" />
                                    </button>
                                    <button className="p-2.5" onClick={() => { setSort('grid') }}>
                                        <ViewGridAddIcon className="w-5 h-5 text-gray-400 focus:outline-none" />
                                    </button>
                                </div>
                                <div className="w-32">
                                    <Select options={["おすすめ", "New"]} value={filter} onChange={(selected: string) => setFilter(selected)} />
                                </div>
                            </div>

                            {/* lists section */}
                            <div>
                                {sort === 'list'
                                    ? <ListViewSearch lists={itemGridData} />
                                    : sort === 'grid'
                                        ? <GridViewSearch lists={itemGridData} />
                                        : null}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='sticky top-0 right-0 hidden w-full h-screen col-span-3 pt-16 lg:block'>
                    <GoogleMap options={mapOptions} />
                </div>
            </div>
        </MainLayout>
    )
}

export default Search
