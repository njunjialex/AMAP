// src/pages/CategoryProductsPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import OrderModal from "../components/OrderModal";
import "./Products.css";

const CategoryProductsPage = () => {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/?category=${name}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching category products:", error));
  }, [name]);

  return (
    <section className="products">
      <h2>Products under "{name}"</h2>
      <main>
        {products.map((product) => (
          <div key={product.id} className="card">
            <div className="image">
              <img src={`http://127.0.0.1:8000/media/${product.image}`} alt={product.name} />
            </div>
            <p className="product_name">{product.name}</p>
            <p className="product_description">{parse(product.description)}</p>
            <p className="original_price">
              {product.original_price > 0 && <del>Ksh{product.original_price}</del>}
              Ksh<b>{product.selling_price}/{product.measure}</b>
            </p>
            <button className="btn" onClick={() => setSelectedProduct(product)}>Order</button>
          </div>
        ))}
      </main>

      {selectedProduct && (
        <OrderModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
};

export default CategoryProductsPage;
