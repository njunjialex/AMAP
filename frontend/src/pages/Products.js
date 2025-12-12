import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import Navbar from "../components/Navbar";
import OrderModal from "../components/OrderModal"; // Import the Order Modal component
import "./Products.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products/")
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error("Error fetching products:", error));
    }, []);

    return (
        
        <section className="products">
            <Navbar />
            <main>
                {products.map((product) => (
                    <div key={product.id} className="cardi">
                        <div className="image">
                          <img src={`http://127.0.0.1:8000/media/${product.image}`} alt={product.name} />
                        </div>
                        <p className="product_name"></p>
                        <p className="product_description"><b>{product.name}</b><br></br> {parse(product.description)}</p>
                        <p className="original_price">
                            {product.original_price > 0 && <del> Ksh{product.original_price}</del>}  Ksh<b>{product.selling_price}/{product.measure}</b>
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
}

export default Products;