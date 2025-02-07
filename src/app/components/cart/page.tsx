"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { Josefin_Sans, Lato } from "next/font/google";
import {
  getCartItems,
  updateCartQuantity,
  updateCartCount,
  removeFromCart,
} from "../actions/actions"; // Adjust the path as necessary
import Link from "next/link";
import { Product } from "../wishlist/page";

// Use Lato font
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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const handleQuantityChange = (id: string, quantity: number) => {
    const products: Product[] = JSON.parse(localStorage.getItem("products") || "[]");
    const productIndex = products.findIndex((item) => item.id === id);
    const cartIndex = cartItems.findIndex((item) => item.id === id);

    if (productIndex > -1 && cartIndex > -1) {
      const product = products[productIndex];
      const cartItem = cartItems[cartIndex];

      if (quantity > cartItem.stockLevel + product.stockLevel) {
        Swal.fire({
          icon: "error",
          title: "Out of Stock",
          text: "This product is out of stock.",
        });
        return;
      }

      updateCartQuantity(id, quantity);
      setCartItems(getCartItems());

      // Update stock level in products
      products[productIndex].stockLevel -= quantity - cartItem.stockLevel;
      localStorage.setItem("products", JSON.stringify(products));

      // Update cart count in Navbar
      updateCartCount();
    }
  };

  const handleIncrement = (id: string) => {
    const product = cartItems.find((item) => item.id === id);
    if (product) {
      handleQuantityChange(id, product.stockLevel + 1);
    }
  };

  const handleDecrement = (id: string) => {
    const product = cartItems.find((item) => item.id === id);
    if (product && product.stockLevel > 1) {
      handleQuantityChange(id, product.stockLevel - 1);
    }
  };

  const handleRemove = (id: string) => {
    const products: Product[] = JSON.parse(localStorage.getItem("products") || "[]");
    const productIndex = products.findIndex((item) => item.id === id);
    const cartItem = cartItems.find((item) => item.id === id);

    if (productIndex > -1 && cartItem) {
      // Restore stock level in products
      products[productIndex].stockLevel += cartItem.stockLevel;
      localStorage.setItem("products", JSON.stringify(products));
    }

    removeFromCart(id);
    setCartItems(getCartItems());

    // Update cart count in Navbar
    updateCartCount();
  };

  const calculation = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.discountPercentage
        ? item.price - (item.price * item.discountPercentage) / 100
        : item.price;
      return total + discountedPrice * item.stockLevel;
    }, 0);
  };

  const handleProceed = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Your cart is empty",
        text: "Please add some products to your cart before proceeding to checkout.",
      });
    } else {
      Swal.fire({
        title: "Proceed to Checkout?",
        text: "Please review your cart before checkout",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Success", "Your order has been successfully processed", "success");
          setCartItems([]);
          localStorage.removeItem("cart");
          window.location.reload();
        }
      });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="w-full bg-[#F6F5FF] h-60">
        <div className="max-w-[1210px] px-4 h-full flex items-center justify-between m-auto">
          <div>
            <h1 className={`textColor text-[36px] font-bold ${josefin.className}`}>
              Shopping Cart
            </h1>
            <ul className={`flex gap-2 text-[16px] ${lato.className} font-extrabold`}>
              <Link href={"/"}><li>Home</li></Link>
              <li>.</li>
              <Link href={"/pages"}><li>Pages</li></Link>
              <li className="h-4 text-[#FB2E86]">.</li>
              <Link href={"/components/cart"}><li className="text-[#FB2E86]">Shopping Cart</li></Link>
            </ul>
          </div>
        </div>
      </div>

      <div className="cart-container">
        <div className="max-w-[1210px] mx-auto px-4 gap-8 flex flex-col lg:flex-row">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty!</p>
            </div>
          ) : (
            <div className="cart-items flex-1">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item flex items-center justify-between mb-4 p-4 bg-white shadow-md rounded-lg">
                  <div className="flex items-center gap-4">
                    <Image src={item.imageUrl} alt={item.name} width={100} height={100} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h2 className="item-name text-lg font-semibold">{item.name}</h2>
                      <h2>Quantity: {item.stockLevel}</h2>
                    </div>
                  </div>
                  <div className="item-price">
                    <p className="font-semibold">
                      ₹
                      {item.discountPercentage
                        ? (item.price - (item.price * item.discountPercentage) / 100).toFixed(2)
                        : item.price}
                    </p>
                  </div>
                  <div className="item-quantity flex items-center gap-2">
                    <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => handleDecrement(item.id)}>-</button>
                    <span>{item.stockLevel}</span>
                    <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => handleIncrement(item.id)}>+</button>
                  </div>
                  <button className="remove-btn px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleRemove(item.id)}>Remove</button>
                </div>
              ))}
            </div>
          )}

          <div className="cart-total bg-white p-6 shadow-md rounded-lg mt-4 lg:mt-0">
            <h2 className="text-xl font-bold">Total: ₹{calculation().toFixed(2)}</h2>
            <Link href={"/components/checkout"}>
              <button onClick={handleProceed} className="w-full bg-[#FB2E86] text-white py-2 rounded-md mt-4">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
