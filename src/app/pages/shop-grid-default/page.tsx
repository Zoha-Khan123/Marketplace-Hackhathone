"use client";
import Link from "next/link";
import Image from "next/image";
import { Lato, Josefin_Sans } from "next/font/google"; // Import Josefin font
import Swal from "sweetalert2";
import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  addToCart,
  getWishlistItems,
  toggleWishlist,
} from "@/app/components/actions/actions";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // Import filled and outline heart icons

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

export default function ShopGridDefault() {
  const [products, setProducts] = useState<Product[]>([]); // State to store products
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search input

  useEffect(() => {
    const query = '*[_type == "product"]'; // Define the query to fetch products
    async function fetchProducts() {
      const fetchedProducts: Product[] = await client.fetch(query);
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      if (storedProducts.length > 0) {
        setProducts(storedProducts);
      } else {
        setProducts(fetchedProducts);
        localStorage.setItem("products", JSON.stringify(fetchedProducts));
      }
      setWishlist(getWishlistItems());
    }
    fetchProducts();
  }, []);

  const handleWishlistToggle = (product: Product) => {
    toggleWishlist(product);
    setWishlist(getWishlistItems());
  };

  const isProductInWishlist = (product: Product) => {
    return wishlist.some((item) => item.id === product.id);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (product.stockLevel > 0) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `${product.name.slice(0, 15)} added to cart`,
        showConfirmButton: false,
        timer: 1000,
      });
      addToCart(product);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, stockLevel: p.stockLevel - 1 } : p
        )
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: "This product is out of stock.",
      });
    }
  };

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header Section */}
      <div className={`w-full bg-[#F6F5FF] h-60 ${josefin.className}`}>
        <div className="max-w-[1210px] px-2 h-full flex items-center m-auto">
          <div>
            <h1 className="textColor block text-[36px] font-bold">Shop Grid Default</h1>
            <ul className="flex gap-2 text-[16px]">
              <Link href={"/"}>
                <li>Home</li>
              </Link>
              <li className="font-extrabold">.</li>
              <li>Pages</li>
              <li className="font-extrabold h-4 text-[#FB2E86]">.</li>
              <Link href={"/components/pages"}>
                <li className="text-[#FB2E86]">Shop Grid Default</li>
              </Link>
            </ul>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-[1210px] px-2 h-full my-20 sm:flex justify-between items-center m-auto">
        <div>
          <h2 className={`textColor font-bold ${josefin.className}`}>
            Ecommerce Accessories & Fashion items
          </h2>
          <p className={`text-[10px] text-[#8A8FB9] ${lato.className}`}>
            About 9,620 results (0.62 seconds)
          </p>
        </div>

        <div className="my-6">
          <span className="mx-4">
            <label htmlFor="" className="textColor">
              Per Page:
            </label>
            <input
              type="text"
              name=""
              id=""
              className=" w-14 rounded-none ml-2 border-neutral-200 border"
            />
          </span>
          <span className="mx-4">
            <label htmlFor="" className="textColor">
              Sort By:
            </label>
            <input
              type="text"
              placeholder="Best Match"
              name=""
              id=""
              className=" w-16 placeholder:text-[9px] place-items-center rounded-none ml-2 border-neutral-200 border"
            />
          </span>
          <span className="mx-4 mt-3 block lg:inline">
            <label htmlFor="" className="textColor">
              View:
            </label>
            <Image
              src={"/shopGridProducts/clarity_grid-view-solid.png"}
              height={10}
              width={10}
              alt="img"
              className="inline mx-1"
            ></Image>
            <Image
              src={"/shopGridProducts/fa-solid_list.png"}
              height={10}
              width={10}
              alt="img"
              className="inline"
            ></Image>
            <input
              type="text"
              name=""
              id=""
              value={searchQuery} // Bind input to searchQuery state
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
              className=" max-w-18 rounded-none ml-2 border-neutral-200 border"
              placeholder="Search for chair, sofa..."
            />
          </span>
        </div>
      </div>

      {/* Product Grid Section */}
      <div>
        <section className="flex items-center justify-center">
          <div className="grid max-w-[1000px] p-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-6 py-6 gap-5">
            {filteredProducts.map((item, idx) => (
              <div key={idx}>
                <Card className="min-h-64 border-none rounded-none group transition-all duration-300 hover:bg-[#F7F7F7] mb-10">
                  {/* Image Container */}
                  <Link href={`../../components/dynamicpage/latestproduct/${item.id}`}>
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
                              item.price - (item.price * item.discountPercentage) / 100
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Stock Status */}
                      <p
                        className={`text-xs font-semibold ${item.stockLevel > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {item.stockLevel > 0 ? "In Stock" : "Out of Stock"}
                      </p>

                      {/* Add to Cart Button */}
                      <button
                        className={`mt-3 mb-4 bg-[#31208A] text-white py-2 px-4 rounded-md hover:bg-[#08D15F] transition duration-300 ${item.stockLevel === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                        onClick={(e) => handleAddToCart(e, item)}
                        disabled={item.stockLevel === 0}
                      >
                        Add to Cart
                      </button>
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
