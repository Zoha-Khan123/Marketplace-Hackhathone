import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../wishlist/page';

interface ProductDetailProps {
  selectedProduct: Product;
  relatedProducts: Product[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ selectedProduct, relatedProducts }) => {
  return (
    <div>
      <div className="product-detail">
        <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} width={500} height={500} />
        <h1>{selectedProduct.name}</h1>
        <p>{selectedProduct.description}</p>
        <p>Price: ${selectedProduct.price}</p>
      </div>
      <div className="related-products">
        <h2>Related Products</h2>
        <div className="related-products-list">
          {relatedProducts.map((product) => (
            <div key={product.id} className="related-product-item">
              <Link href={`/product/${product.id}`}>
                <a>
                  <Image src={product.imageUrl} alt={product.name} width={200} height={200} />
                  <h3>{product.name}</h3>
                  <p>Price: ${product.price}</p>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;