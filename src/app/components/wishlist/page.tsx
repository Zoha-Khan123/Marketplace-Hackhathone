"use client";
import Link from "next/link";
import Image from "next/image";
import { Lato, Josefin_Sans } from "next/font/google"; // Import Josefin font
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  getWishlistItems,
  toggleWishlist,
} from "@/app/components/actions/actions";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const lato = Lato({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const josefin = Josefin_Sans({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  discountPercentage: number;
  isFeaturedProduct: boolean;
  stockLevel: number;
  category: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    setWishlist(getWishlistItems());
  }, []);

  const handleWishlistToggle = (product: Product) => {
    toggleWishlist(product);
    setWishlist(getWishlistItems());
  };

  const isProductInWishlist = (product: Product) => {
    return wishlist.some((item) => item.id === product.id);
  };

  return (
    <>
      <div className={`w-full bg-[#F6F5FF] h-60 ${josefin.className}`}>
        <div className="max-w-[1210px] px-2 h-full flex items-center m-auto">
          <div>
            <h1 className="textColor block text-[36px] font-bold">Wishlist</h1>
            <ul className="flex gap-2 text-[16px]">
              <Link href={"/"}>
                <li>Home</li>
              </Link>
              <li className="font-extrabold ">.</li>
              <li>Pages</li>
              <li className="font-extrabold h-4 text-[#FB2E86]">.</li>
              <Link href={"/components/pages"}>
                <li className="text-[#FB2E86]">Wishlist</li>
              </Link>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-[1210px] px-2 h-full my-20 sm:flex justify-between items-center m-auto">
        <div>
          <h2 className={`textColor font-bold ${josefin.className}`}>
            Your Wishlist
          </h2>
        </div>
      </div>

      <div>
        <section className="flex items-center justify-center">
          <div className="grid max-w-[1000px] p-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-6 py-6 gap-5">
            {wishlist.map((item, idx) => (
              <div key={idx}>
                <Card className="min-h-64 border-none rounded-none group transition-all duration-300 hover:bg-[#F7F7F7] mb-10">
                  {/* Image Container */}
                  <Link
                    href={`../../components/dynamicpage/latestproduct/${item.id}`}
                  >
                    <div className="w-full h-64 relative overflow-hidden p-3">
                      {/* Discount Percentage on top of the image */}
                      <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 text-xs font-bold rounded">
                        {item.discountPercentage}% OFF
                      </div>
                      <div
                        className={`absolute right-5 cursor-pointer`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleWishlistToggle(item);
                        }}
                      >
                        {isProductInWishlist(item) ? (
                          <AiFillHeart className="text-2xl text-red-500 hover:text-red-700 transition-colors duration-300" />
                        ) : (
                          <AiOutlineHeart className="text-2xl text-gray-500 hover:text-red-700 transition-colors duration-300" />
                        )}
                      </div>

                      <Image
                        src={item.imageUrl}
                        alt="image"
                        width={400}
                        height={400}
                        className="w-full h-full object-contain bg-[#F7F7F7]"
                      />

                      {/* View Details Button */}

                      <button className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[#08D15F] text-white text-xs font-semibold py-2 px-4 rounded transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        View Details
                      </button>
                    </div>

                    <div className="flex flex-col justify-between items-center">
                      {/* Product Title */}
                      <h3 className="font-bold mt-2 text-center text-sm text-[#31208A] my-2 transition-colors duration-300">
                        {item.name.slice(0, 15)}
                      </h3>

                      {/* Price Information */}
                      <div className="price text-[var(--textColor)] flex justify-center items-center text-base my-2 transition-colors duration-300">
                        <div className="flex flex-row items-center text-sm gap-4 text-[#1518754D]">
                          {/* Displaying Original Price with line-through */}
                          <p className="text-[#1518754D] line-through">
                            ${item.price}
                          </p>

                          {/* Final Price */}
                          <p className="text-lg font-bold text-[#31208A]">
                            $
                            {Math.round(
                              item.price -
                                (item.price * item.discountPercentage) / 100
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
