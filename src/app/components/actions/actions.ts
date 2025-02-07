import { Product } from "../wishlist/page";

// Add To Cart
export const addToCart = (product: Product) => {
  const cart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
  const products: Product[] = JSON.parse(
    localStorage.getItem("products") || "[]"
  );
  const existingProductIndex = cart.findIndex((item) => item.id === product.id);
  const existingProductIndexInProducts = products.findIndex(
    (item) => item.id === product.id
  );

  if (existingProductIndex > -1) {
    if (products[existingProductIndexInProducts].stockLevel > 0) {
      cart[existingProductIndex].stockLevel += 1;
      products[existingProductIndexInProducts].stockLevel -= 1;
    } else {
      alert("Product is out of stock");
      return;
    }
  } else {
    if (product.stockLevel > 0) {
      cart.push({
        ...product,
        stockLevel: 1,
      });
      products[existingProductIndexInProducts].stockLevel -= 1;
    } else {
      alert("Product is out of stock");
      return;
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("products", JSON.stringify(products));

  // After adding item to cart, we update the cart count in Navbar directly
  updateCartCount();
};
// Remove From Cart
export const removeFromCart = (id: string) => {
  const cart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
  const updatedCart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  // After removing item from cart, we update the cart count in Navbar directly
  updateCartCount();
};

// Update Add Cart Count In Navbar
export const updateCartCount = () => {
  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  const totalCount = cartItems.reduce(
    (total: number, item: Product) => total + item.stockLevel,
    0
  );

  // Dispatch a custom event with the updated cart count
  const event = new CustomEvent("cartCountUpdated", { detail: totalCount });
  window.dispatchEvent(event);
};

//Update From Cart
export const updateCartQuantity = (ProductId: string, quantity: number) => {
  let cart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
  const productIndex = cart.findIndex((item) => item.id === ProductId);

  if (productIndex > -1) {
    cart[productIndex].stockLevel = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

//Get Item
export const getCartItems = (): Product[] => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};
// Add or Remove From Wishlist
export const toggleWishlist = (product: Product) => {
  const wishlist: Product[] = JSON.parse(
    localStorage.getItem("wishlist") || "[]"
  );

  const existingProductIndex = wishlist.findIndex(
    (item) => item.id === product.id
  );

  if (existingProductIndex > -1) {
    wishlist.splice(existingProductIndex, 1); // Remove from wishlist
  } else {
    wishlist.push(product); // Add to wishlist
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // Dispatch a custom event with the updated wishlist count
  const event = new CustomEvent("wishlistCountUpdated", {
    detail: wishlist.length,
  });
  window.dispatchEvent(event);
};

// Get Wishlist Items
export const getWishlistItems = (): Product[] => {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
};
