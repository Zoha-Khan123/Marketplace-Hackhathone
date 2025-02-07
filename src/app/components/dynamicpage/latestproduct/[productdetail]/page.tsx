"use client";
import { Product } from "@/app/components/wishlist/page";
import { Card } from "@/components/ui/card";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ productdetail: string }>;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state for better UX
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]); // Initialize as an array

  // Unwrap `params` using React.use()
  const unwrappedParams = React.use(params);
  const productDetailId = unwrappedParams.productdetail;

  async function fetchProducts() {
    try {
      const query = `
        *[_type == "product"]{
          id,
          name,
          "imageUrl": image.asset->url,
          price,
          description,
          discountPercentage,
          isFeaturedProduct,
          stockLevel,
          category
        }
      `;

      const fetchedProducts = await client.fetch(query);
      setProducts(fetchedProducts); // Set the fetched products to state
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Stop loading once data is fetched or an error occurs
    }
  }

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Find the selected product after products are fetched
  useEffect(() => {
    if (products.length > 0) {
      const product = products.find((p) => p.id === productDetailId);
      setSelectedProduct(product || null); // Set selected product or null if not found

      const related = products.filter((p) => p.id !== productDetailId);
      const shuffled = related.sort(() => 0.5 - Math.random());
      setRelatedProducts(shuffled.slice(0, 6));
    }
  }, [products, productDetailId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-violet-500"></div>
      </div>
    );
  }

  if (!selectedProduct) {
    return <p>Product not found!</p>; // Handle case where product is not found
  }

  return (
    <div>
      {/* Selected Item */}
      <div className="flex flex-col justify-center items-center mt-10 sm:flex-row">
        <div className="image p-6 relative">
          {/* Discount Percentage on top of the image */}
          {selectedProduct.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 text-xs font-bold rounded">
              {selectedProduct.discountPercentage}% OFF
            </div>
          )}
          <Image
            src={selectedProduct.imageUrl}
            width={500}
            height={400}
            alt={selectedProduct.name}
            className="bg-violet-100 rounded-xl mr-10"
          />
        </div>
        <div className="p-4 py-20">
          <h1 className="text-4xl my-6">{selectedProduct.name.slice(0, 15)}</h1>
          <p className="max-w-80 text-justify mb-4">
            {selectedProduct.description}
          </p>
          <p className="text-lg font-bold mb-2">
            Price: ${selectedProduct.price}
          </p>
          {selectedProduct.discountPercentage > 0 && (
            <p className="text-lg font-bold">
              Discounted Price: $
              {selectedProduct.price -
                (selectedProduct.price * selectedProduct.discountPercentage) /
                  100}
            </p>
          )}
          <div className=" my-4">
            <button className="bg-[#000000] text-white py-2 px-4 rounded-md hover:bg-[#141414ef] transition duration-300 transform hover:scale-105 ">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />

      {/* Related Products Section */}
      <div className="flex justify-center items-center">
        <div>
          <h2 className="text-2xl">Related Products</h2>

          <section className="flex justify-center">
            <div className="grid max-w-[1000px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-6 py-6 gap-5">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/components/dynamicpage/latestproduct/${item.id}`}
                >
                  <div>
                    <Card className="min-h-64 shadow-md rounded-none group transition-all duration-300 hover:bg-[#31208A]">
                      {/* Image Container */}
                      <div className="w-full h-64 relative bg-white overflow-hidden">
                        {/* Discount Percentage on top of the image */}
                        <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 text-xs font-bold rounded">
                          {item.discountPercentage}% OFF
                        </div>

                        <Image
                          src={item.imageUrl}
                          alt="image"
                          width={400}
                          height={400}
                          className="w-full h-full object-contain bg-[#F6F7FB]"
                        />

                        {/* View Details Button */}
                        <div className="absolute flex justify-center items-center top-1 right-0 gap-2 transform -translate-x-1/2 duration-300 opacity-0 group-hover:opacity-100">
                          <div>
                            <Image
                              src="/cart.png"
                              width={25}
                              height={25}
                              alt="img"
                            />
                          </div>
                          <div>
                            <Image
                              src="/uil_heart-alt.png"
                              width={15}
                              height={15}
                              alt="img"
                            />
                          </div>
                          <div>
                            <Image
                              src="/uil_search-plus.png"
                              width={15}
                              height={15}
                              alt="img"
                            />
                          </div>
                        </div>
                        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#08D15F] text-white text-xs font-semibold py-2 px-4 rounded transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                          View Details
                        </button>
                      </div>

                      {/* Product Title */}
                      <h3 className="font-bold mt-2 text-center text-lg text-[#FB2E86] my-2 transition-colors duration-300 group-hover:text-white">
                        {item.name.slice(0, 10)}
                      </h3>

                      {/* Color Options */}
                      <div className="flex justify-center items-center gap-1 my-2">
                        <div className="bg-[#05E6B7] w-3 h-1 rounded-full group-hover:bg-white transition-colors"></div>
                        <div className="bg-[#F701A8] w-3 h-1 rounded-full group-hover:bg-white transition-colors"></div>
                        <div className="bg-[#00009D] w-3 h-1 rounded-full group-hover:bg-white transition-colors"></div>
                      </div>

                      {/* Product Code */}
                      <div className="code text-[var(--textColor)] flex justify-center items-center text-base my-2 transition-colors duration-300 group-hover:text-white">
                        {/* Code - {item.code} */}
                      </div>

                      {/* Product Price with Discounted Price */}
                      <div className="price text-[var(--textColor)] flex justify-center items-center text-base my-2 transition-colors duration-300 group-hover:text-white">
                        <div className="flex flex-row items-center text-sm gap-4 text-[#1518754D] group-hover:text-white">
                          {/* Original Price */}
                          <p className="text-[#1518754D] line-through group-hover:text-white">
                            ${item.price}
                          </p>

                          {/* Discounted Price */}
                          <p className="text-lg font-bold text-[#31208A] group-hover:text-white">
                            $
                            {Math.round(
                              item.price -
                                (item.price * item.discountPercentage) / 100
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <div className="flex justify-center items-center my-4">
                        <button className="bg-[#31208A] text-white py-2 px-4 rounded-md hover:bg-[#F701A8] transition duration-300 group-hover:bg-[#F701A8] group-hover:text-white">
                          Add to Cart
                        </button>
                      </div>
                    </Card>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
