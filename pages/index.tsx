import Head from "next/head";
import { Pill } from "@element";
import { CategoryItem, ItemGrid, IItemGrid, SingleListItem } from "@comp";
import Link from "next/link";

const itemGridData: IItemGrid[] = [
  {
    location: "東京都目黒区東京都目黒区東京都目黒区",
    rating: 4.59,
    cases: 99,
    title: "OPEN割🎉151_Forever新宿🌿🍑大人気ゲーム機🎮超大型65㌅テレビ📺鍋会・たこパ🐙",
    price: 1386,
    people: 15,
    area: "24m²",
    tag: "貸し会議室",
  },
];

// gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Head>
        <title>Home | Space Rental</title>
      </Head>
      <main className="px-4 mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
        <div className="py-10">
          <Link href="/auth/login">
            <a className="inline-block font-normal text-gray-500 hover:text-primary">
              Login
            </a>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-6 gap-y-6">
          {Array(8)
            .fill(0)
            .map((res, index) => (
              <CategoryItem
                key={index}
                title="イベントスペース"
                subTitle="113件"
              />
            ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((res, index) => (
              <ItemGrid key={index} data={itemGridData[0]} />
            ))}
        </div>
        <div className="mb-5">
          <Pill className="mr-5" />
          <Pill variant="error" />
        </div>
        <SingleListItem data={itemGridData[0]} />
      </main>
    </div>
  );
}
