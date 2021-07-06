import Head from "next/head";
import { Container, Pill } from "@element";
import { CategoryItem, ItemGrid, IItemGrid, SingleListItem, ReviewItem, SingleReview, IReviewComment } from "@comp";
import { Header, Footer } from "@layout";
import Image from "next/image";

const reviewComment: IReviewComment[] = [
  {
    name: "Name",
    date: "2021年6月",
    comment: "清潔さ"
  }
]

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
      <Header />
      <main>
        <div className="relative w-full mt-16 md:mt-0 aspect-w-12 aspect-h-5">
          <Image
            className="z-0"
            src="/hero-bg.svg"
            alt="category items"
            layout="fill"
            role="presentation"
            objectFit="cover"
            objectPosition="center"
          />
          <Container className="absolute top-0 left-0 z-10 flex items-center w-full h-full">
            <p>TIME BOOK</p>
          </Container>
        </div>
        <Container>
          <div className="grid grid-cols-1 pt-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-6 gap-y-6">
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
            <Pill className="mr-5 spa" />
            <Pill variant="error" />
          </div>
          <SingleListItem data={itemGridData[0]} />
          <div className="grid max-w-3xl grid-cols-1 py-5 space-y-2 sm:grid-cols-2">
            {[4.4, 4.0, 2.0, 3.2].map((res, index) => (
              <ReviewItem key={index} id={`review${index}`} title="清潔さ" value={res} className="mr-16" />
            ))}
          </div>
          <div className="pb-5">
            <SingleReview data={reviewComment[0]} />
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
