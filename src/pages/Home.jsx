import React, { useContext, useState, useMemo, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const categories = [
  "Todos",
  "Insumos De Pestañas",
  "Insumos De Uñas",
  "Maquillaje",
  "Skincare",
];

const Home = () => {
  const { products, loading, addToCart, searchTerm } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      const matchesCategory =
        selectedCategory === "Todos" || p.category === selectedCategory;
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Ordenar de la A a la Z
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [products, selectedCategory, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  if (loading)
    return <div className="loading-state">Cargando productos...</div>;

  return (
    <div className="home-container">
      <h2 className="page-title">Nuestros Productos</h2>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image_url || "https://via.placeholder.com/200"}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <h3 className="product-title" title={product.name}>
                  {product.name}
                </h3>
                <span className="product-category">{product.category}</span>
                <p className="product-price">
                  ${Number(product.price).toFixed(2)}
                </p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No hay productos en esta categoría.</div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.5rem",
            marginTop: "3rem",
            marginBottom: "2rem",
          }}
        >
          <button
            className="btn btn-outline-dark"
            style={{
              borderRadius: "25px",
              padding: "0.6rem 1.5rem",
              fontWeight: "bold",
            }}
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            ← Anterior
          </button>
          <span
            style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#555" }}
          >
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="btn btn-outline-dark"
            style={{
              borderRadius: "25px",
              padding: "0.6rem 1.5rem",
              fontWeight: "bold",
            }}
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
