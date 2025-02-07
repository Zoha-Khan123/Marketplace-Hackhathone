import { Card } from "@/components/ui/card";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Product } from "../wishlist/page";

interface ProductCardProps {
  item: Product;
  isProductInWishlist: (product: Product) => boolean;
  handleWishlistToggle: (product: Product) => void;
  handleAddToCart: (e: React.MouseEvent, product: Product) => void;
}

const ProductCard = ({
  item,
  isProductInWishlist,
  handleWishlistToggle,
  handleAddToCart,
}: ProductCardProps) => {
  return (
    <Card className="min-h-64 shadow-md rounded-none group transition-all duration-300 hover:bg-[#31208A]">
      {/* Image Container */}
      <div className="w-full h-64 relative bg-white overflow-hidden">
        {/* Discount Percentage on top of the image */}
        <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 text-xs font-bold rounded">
          {item.discountPercentage}% OFF
        </div>

        {/* Wishlist Toggle */}
        <div
          className="absolute top-2 right-2 cursor-pointer"
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

        {/* Image */}
        <Image
          src={item.imageUrl}
          alt="image"
          width={400}
          height={400}
          className="w-full h-full object-contain bg-[#F6F7FB]"
        />

        {/* Add to Cart Button */}
        <button
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#08D15F] text-white text-xs font-semibold py-2 px-4 rounded transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          onClick={(e) => handleAddToCart(e, item)}
        >
          Add to Cart
        </button>
      </div>

      {/* Product Title */}
      <h3 className="font-bold mt-2 text-center text-lg text-[#FB2E86] my-2 transition-colors duration-300 group-hover:text-white">
        {item.name.slice(0, 10)}
      </h3>

      {/* Product Price with Discounted Price */}
      <div className="price text-[var(--textColor)] flex justify-center items-center text-base my-2 transition-colors duration-300 group-hover:text-white">
        <div className="flex flex-row items-center text-sm gap-4 text-[#1518754D] group-hover:text-white">
          <p className="text-[#1518754D] line-through group-hover:text-white">
            ${item.price}
          </p>

          <p className="text-lg font-bold text-[#31208A] group-hover:text-white">
            $
            {Math.round(
              item.price - (item.price * item.discountPercentage) / 100
            )}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;




