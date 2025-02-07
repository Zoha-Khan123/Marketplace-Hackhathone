'use client';
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // Heart Icons for wishlist
import Swal from "sweetalert2";
import { addToCart, getWishlistItems, toggleWishlist } from "@/app/components/actions/actions";
import { Product } from "../wishlist/page";

const LatestProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const query = '*[_type == "product"]'; // Define the query to fetch products
        const fetchedProducts: Product[] = await client.fetch(query);
        const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
        if (storedProducts.length > 0) {
          setProducts(storedProducts.slice(0, 8));
        } else {
          setProducts(fetchedProducts);
          localStorage.setItem("products", JSON.stringify(fetchedProducts));
        }
        setWishlist(getWishlistItems());
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="flex justify-center items-center mt-24">
        <h1 className="text-textColor text-4xl font-bold mb-5">
          Latest Products
        </h1>
      </div>

      <div>
        <section className="flex items-center justify-center">
          <div className="grid max-w-[1000px] p-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-6 py-6 gap-5">
            {products.map((item) => (
              <div key={item.id}>
                <Card className="min-h-64 border-none rounded-none group transition-all duration-300 hover:bg-[#F7F7F7] mb-10">
                  <Link href={`../../components/dynamicpage/latestproduct/${item.id}`}>
                    <div className="w-full h-64 relative overflow-hidden p-3">
                      {/* Discount Percentage on top of the image */}
                      {item.discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 text-xs font-bold rounded">
                          {item.discountPercentage}% OFF
                        </div>
                      )}

                      {/* Wishlist Toggle */}
                      <div
                        className="absolute right-5 cursor-pointer"
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
                        className="w-full h-full object-contain bg-[#F7F7FB]"
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

                      {/* Stock Status */}
                      <p
                        className={`text-xs font-semibold ${item.stockLevel > 0 ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {item.stockLevel > 0 ? 'In Stock' : 'Out of Stock'}
                      </p>

                      {/* Add to Cart Button */}
                      <button
                        className={`mt-3 mb-4 bg-[#31208A] text-white py-2 px-4 rounded-md hover:bg-[#08D15F] transition duration-300 ${item.stockLevel === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
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
    </div>
  );
};

export default LatestProducts;