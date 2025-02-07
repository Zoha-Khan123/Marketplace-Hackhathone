"use client";
import React, { useEffect, useState } from "react";
import { getCartItems } from "../actions/actions";
import Link from "next/link";
import { Josefin_Sans, Lato } from "next/font/google";
import Image from "next/image";
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

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [formValues, setFormValues] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    city: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    lastName: false,
    email: false,
    phone: false,
    address: false,
    zipCode: false,
    city: false,
  });

  useEffect(() => {
    setCartItems(getCartItems());
    const appliedDiscount = localStorage.getItem("appliedDiscount");
    if (appliedDiscount) {
      setDiscount(Number(appliedDiscount));
    }
  }, []);

  // Calculate the subtotal, discount, and final price
  const subTotal = cartItems.reduce((total, item) => {
    return total + Number(item.price) * item.stockLevel;
  }, 0);

  const totalDiscount = cartItems.reduce((total, item) => {
    const discountedPrice = item.discountPercentage
      ? Number(item.price) -
        (Number(item.price) * item.discountPercentage) / 100
      : Number(item.price);
    const discountAmount =
      (Number(item.price) - discountedPrice) * item.stockLevel;
    return total + discountAmount;
  }, 0);

  const finalTotal = subTotal - totalDiscount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const validateForm = () => {
    const errors = {
      name: !formValues.name,
      lastName: !formValues.lastName,
      email: !formValues.email,
      phone: !formValues.phone,
      address: !formValues.address,
      zipCode: !formValues.zipCode,
      city: !formValues.city,
    };
    setFormErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handlePlaceOrder = () => {
    if (validateForm()) {
      localStorage.removeItem("appliedDiscount");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="w-full bg-[#F6F5FF] h-60 ">
            <div className="max-w-[1210px] px-2 h-full flex items-center m-auto">
                <div>
            <h1 className={`textColor block text-[36px] font-bold ${josefin.className}`}>Contact Us</h1>
            <ul className={`flex gap-2 text-[16px] ${lato.className} font-extrabold`}>
                <Link href={'/'}>
                <li>Home</li>
                </Link>
                <li>.</li>
                <Link href={'/components/cart'}>
                <li>Cart</li>
                </Link>
                <li className="h-4 text-[#FB2E86]">.</li>
                <Link href={'/components/checkout'}>
                <li className="text-[#FB2E86]">CheckOut</li>
                </Link>
            </ul>
                </div>
            </div>
        </div>


      {/* Main Content */}
      <div className="bg-white min-h-screen py-10 ">
        <div className="max-w-[1210px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Billing Information */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md ">
            <h2 className="text-2xl font-bold textColor mb-6">Billing Information</h2>
            <form className="space-y-4">
              {[
                { label: "Name", id: "name" },
                { label: "Last Name", id: "lastName" },
                { label: "Email", id: "email" },
                { label: "Phone", id: "phone" },
                { label: "Address", id: "address" },
                { label: "Zip Code", id: "zipCode" },
                { label: "City", id: "city" },
              ].map(({ label, id }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-[#1D3178]">
                    {label}
                  </label>
                  <input
                    type="text"
                    id={id}
                    value={formValues[id as keyof typeof formValues]}
                    onChange={handleInputChange}
                    placeholder={`Enter Your ${label}`}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formErrors[id as keyof typeof formErrors]
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-[#FB2E86] focus:border-[#FB2E86]`}
                  />
                  {formErrors[id as keyof typeof formErrors] && (
                    <p className="text-red-500 text-xs mt-1">{`${label} is required`}</p>
                  )}
                </div>
              ))}
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-[#FB2E86] text-white py-2 px-4 rounded-md hover:bg-[#e82a79] transition duration-300"
              >
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold textColor mb-6">Order Summary</h2>
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={item.id}>
                  <div className="flex justify-between items-center space-x-4 mb-4">
                  <div className="flex justify-center items-center">
                    <Image
                      src={item.imageUrl}
                      width={80}
                      height={80}
                      alt={item.name}
                      className="rounded-md"
                    />
                    <div>
                      <h3 className=" font-medium ">{item.name.slice(0,15)}</h3>
                      <p className="text-[#8A8FB9] text-sm">Quantity: {item.stockLevel}</p>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <p className="textColor font-medium">${item.price}</p>
                    </div>
                  </div>
                  {/* Grey Line Separator */}
                  {index < cartItems.length - 1 && (
                    <div className="h-[1px] bg-[#E0E0E0] w-full my-2"></div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-[#8A8FB9]">No items in cart</p>
            )}
           
           </div>
           <div>
            <div className="mt-10 p-6 space-y-2 bg-[#F4F4FC]">
              <p className="flex justify-between textColor">
                SubTotal: <span>${subTotal.toFixed(2)}</span>
              </p>
              <div className="h-[1px] bg-[#E0E0E0] w-full my-2"></div>
              <p className="flex justify-between text-[#8A8FB9]">
                Total Discount: <span>-${totalDiscount.toFixed(2)}</span>
              </p>
              <div className="h-[1px] bg-[#E0E0E0] w-full my-2"></div>
              <p className="flex justify-between textColor font-bold text-lg">
                Final Total: <span>${finalTotal.toFixed(2)}</span>
              </p>
            </div>
          </div>

        </div>
      </div>
      </div>
    </>
  );
};

export default CheckoutPage;