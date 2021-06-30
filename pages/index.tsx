import Head from 'next/head';
import CategoryItem from 'comp/category-item';
import ItemGrid from 'comp/item-grid';
import Pill from 'element/pill';
import { IItemGrid } from 'comp/item-grid';
import SingleListItem from 'comp/single-list-item';

const itemGridData: IItemGrid[] = [
  {
    location: "東京都目黒区",
    rating: 4.59,
    cases: 99,
    title: 'OPEN割🎉151_Forever新宿🌿🍑大人気ゲーム機🎮超大型65㌅テレビ📺鍋会・たこパ🐙',
    price: 1386,
    people: 15,
    area: '24m2',
    tag: '貸し会議室'
  }
]

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Head>
        <title>Space Rental</title>
      </Head>

      <main className="">
        <div role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {Array(4).fill(0).map((res, index) => (
            <CategoryItem key={index} title="イベントスペース" subTitle="113件" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-5">
          {Array(4).fill(0).map((res, index) => (
            <ItemGrid key={index} data={itemGridData[0]} />
          ))}

        </div>
        <div className="mb-5">
          <Pill className="mr-5" />
          <Pill variant='error' />
        </div>
        <SingleListItem data={itemGridData[0]} />
      </main>
    </div>
  )
}
