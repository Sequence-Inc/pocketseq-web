import Head from 'next/head';
import CategoryItem from 'comp/category-item';
import ItemGrid from 'comp/item-grid';

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Head>
        <title>Space Rental</title>
      </Head>

      <main>
        <div className="w-64">
          <CategoryItem title="イベントスペース" subTitle="113件" />
        </div>
        <div className="">
          <ItemGrid />
        </div>
      </main>
    </div>
  )
}
