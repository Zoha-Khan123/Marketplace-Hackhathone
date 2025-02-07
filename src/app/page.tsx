import HomePage from "@/app/components/homepage/page";
import ShoppexProps from "./components/shoppex/page";
import Trending from "./components/trending/page";
import DiscountItem from "./components/discount/page";
import NewsLetter from "./components/news-letter/page";
import Blog from "./components/blog/page";
import LatestProducts from "./components/latest-products/page";



export default function Home() {
  return (
    <main>
      <HomePage />
      <LatestProducts/>
      <ShoppexProps />
      <Trending />
      <DiscountItem></DiscountItem>
      <NewsLetter />
      <Blog />
    </main>
  );
}
