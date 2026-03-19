import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import "./AdminPanel.css";

const AdminPanel = ({ onLogout }) => {
  const {
    products,
    tips,
    addProduct,
    updateProduct,
    deleteProduct,
    addTip,
    deleteTip,
    updateTip,
  } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("products");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [tipSearchTerm, setTipSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTipPage, setCurrentTipPage] = useState(1);
  const itemsPerPage = 10;

  // Edit State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingTip, setEditingTip] = useState(null);

  // New Product State
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Insumos De Pestañas",
    price: "",
    image_url: "",
    stock: "",
    destacado: false,
  });

  const handleAdInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const res = await addProduct(newProduct);
    if (res.success) {
      setStatus({ type: "success", msg: "Producto agregado correctamente!" });
      setNewProduct({
        name: "",
        category: "Insumos De Pestañas",
        price: "",
        image_url: "",
        stock: "",
        destacado: false,
      });
    } else {
      setStatus({
        type: "danger",
        msg: "Error al agregar producto: " + res.error.message,
      });
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
      destacado: product.destacado || false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const res = await updateProduct(editingProduct.id, newProduct);
    if (res.success) {
      setStatus({
        type: "success",
        msg: "Producto actualizado correctamente!",
      });
      setEditingProduct(null);
      setNewProduct({
        name: "",
        category: "Insumos De Pestañas",
        price: "",
        image_url: "",
        stock: "",
        destacado: false,
      });
    } else {
      setStatus({
        type: "danger",
        msg: "Error al actualizar producto: " + res.error.message,
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      const res = await deleteProduct(id);
      if (res.success) {
        setStatus({ type: "success", msg: "Producto eliminado." });
      } else {
        setStatus({
          type: "danger",
          msg: "Error al eliminar: " + res.error.message,
        });
      }
    }
  };

  // New Tip State
  const [newTip, setNewTip] = useState({ title: "", content: "" });

  const handleTipInputChange = (e) => {
    setNewTip({ ...newTip, [e.target.name]: e.target.value });
  };

  const handleAddTip = async (e) => {
    e.preventDefault();
    const res = await addTip(newTip);
    if (res.success) {
      setStatus({ type: "success", msg: "Tip publicado correctamente!" });
      setNewTip({ title: "", content: "" });
    } else {
      setStatus({
        type: "danger",
        msg: "Error al publicar tip: " + res.error.message,
      });
    }
  };

  const handleEditTipClick = (tip) => {
    setEditingTip(tip);
    setNewTip({
      title: tip.title,
      content: tip.tip,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateTip = async (e) => {
    e.preventDefault();
    const res = await updateTip(editingTip.id, newTip);
    if (res.success) {
      setStatus({
        type: "success",
        msg: "Tip actualizado correctamente!",
      });
      setEditingTip(null);
      setNewTip({ title: "", content: "" });
    } else {
      setStatus({
        type: "danger",
        msg: "Error al actualizar tip: " + res.error.message,
      });
    }
  };

  const handleDeleteTip = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este tip?")) {
      const res = await deleteTip(id);
      if (res.success) {
        setStatus({ type: "success", msg: "Tip eliminado." });
      } else {
        setStatus({
          type: "danger",
          msg: "Error al eliminar tip: " + res.error.message,
        });
      }
    }
  };
  
  // Filtered products for search
  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    (p.id || "").toString().includes(productSearchTerm)
  ).sort((a, b) => {
    if (a.destacado && !b.destacado) return -1;
    if (!a.destacado && b.destacado) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [productSearchTerm]);

  // Filtered tips for search
  const filteredTips = tips.filter((t) =>
    (t.title || "").toLowerCase().includes(tipSearchTerm.toLowerCase()) ||
    (t.id || "").toString().includes(tipSearchTerm)
  );

  // Pagination logic for tips
  const indexOfLastTip = currentTipPage * itemsPerPage;
  const indexOfFirstTip = indexOfLastTip - itemsPerPage;
  const currentTips = filteredTips.slice(indexOfFirstTip, indexOfLastTip);
  const totalTipPages = Math.ceil(filteredTips.length / itemsPerPage);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentTipPage(1);
  }, [tipSearchTerm]);

  return (
    <div className="container">
      <div className="admin-panel fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="admin-title mb-0">Panel de Administración</h2>
          <button
            className="btn btn-outline-danger"
            onClick={onLogout}
            style={{ borderRadius: "20px", fontWeight: "600" }}
          >
            Cerrar Sesión
          </button>
        </div>

        {status.msg && (
          <div
            className="alert"
            style={{
              backgroundColor:
                status.type === "success"
                  ? "#d1e7dd"
                  : status.type === "danger"
                    ? "#f8d7da"
                    : "#fff3cd",
              color:
                status.type === "success"
                  ? "#0f5132"
                  : status.type === "danger"
                    ? "#842029"
                    : "#664d03",
              border: `1px solid ${status.type === "success" ? "#badbcc" : status.type === "danger" ? "#f5c2c7" : "#ffecb5"}`,
            }}
          >
            {status.msg}
            <button
              onClick={() => setStatus({ type: "", msg: "" })}
              style={{
                float: "right",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              X
            </button>
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Gestionar Productos
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "tips" ? "active" : ""}`}
            onClick={() => setActiveTab("tips")}
          >
            Gestionar Tips
          </button>
        </div>

        <div className="tab-content mt-4">
          {activeTab === "products" && (
            <div>
              <div className="admin-card">
                <h4 className="mb-4">
                  {editingProduct
                    ? "✨ Editar Producto"
                    : "✨ Agregar Nuevo Producto"}
                </h4>
                <form
                  onSubmit={
                    editingProduct ? handleUpdateProduct : handleAddProduct
                  }
                  className="admin-form"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#555",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        Nombre del Producto
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        style={{
                          border: "2px solid #f0f0f0",
                          borderRadius: "16px",
                          padding: "1.2rem",
                          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                          fontSize: "1.1rem",
                        }}
                        name="name"
                        value={newProduct.name}
                        onChange={handleAdInputChange}
                        placeholder="Ej. Pinzas artesanales"
                        required
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#555",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        Categoría
                      </label>
                      <select
                        className="form-select"
                        style={{
                          border: "2px solid #f0f0f0",
                          borderRadius: "16px",
                          padding: "1.2rem",
                          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                          fontSize: "1.1rem",
                          cursor: "pointer",
                        }}
                        name="category"
                        value={newProduct.category}
                        onChange={handleAdInputChange}
                      >
                        <option>Insumos De Pestañas</option>
                        <option>Insumos De Uñas</option>
                        <option>Insumos De Belleza</option>
                        <option>Maquillaje</option>
                        <option>Skincare</option>
                      </select>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "1.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: "1 1 min-content" }}>
                        <label
                          style={{
                            fontWeight: 600,
                            color: "#555",
                            marginBottom: "0.5rem",
                            display: "block",
                          }}
                        >
                          Precio ($)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          style={{
                            border: "2px solid #f0f0f0",
                            borderRadius: "16px",
                            padding: "1.2rem",
                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                            fontSize: "1.1rem",
                          }}
                          name="price"
                          value={newProduct.price}
                          onChange={handleAdInputChange}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div style={{ flex: "1 1 min-content" }}>
                        <label
                          style={{
                            fontWeight: 600,
                            color: "#555",
                            marginBottom: "0.5rem",
                            display: "block",
                          }}
                        >
                          Stock Disp.
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          style={{
                            border: "2px solid #f0f0f0",
                            borderRadius: "16px",
                            padding: "1.2rem",
                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                            fontSize: "1.1rem",
                          }}
                          name="stock"
                          value={newProduct.stock}
                          onChange={handleAdInputChange}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#555",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        URL de la Imagen
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        style={{
                          border: "2px solid #f0f0f0",
                          borderRadius: "16px",
                          padding: "1.2rem",
                          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                          fontSize: "1.1rem",
                        }}
                        name="image_url"
                        value={newProduct.image_url}
                        onChange={handleAdInputChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>

                    <div className="form-check form-switch mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="destacadoCheck"
                        name="destacado"
                        checked={newProduct.destacado}
                        onChange={handleAdInputChange}
                        style={{ cursor: "pointer", width: "3em", height: "1.5em", marginRight: "10px" }}
                      />
                      <label className="form-check-label" htmlFor="destacadoCheck" style={{ fontWeight: 600, color: "#555", cursor: "pointer", fontSize: "1.1rem" }}>
                        ✨ Producto Destacado (Aparecerá primero en el catálogo)
                      </label>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-3 mt-4">
                    {editingProduct && (
                      <button
                        type="button"
                        className="btn btn-outline-dark"
                        style={{
                          padding: "0.8rem 2.5rem",
                          borderRadius: "30px",
                          fontSize: "1rem",
                        }}
                        onClick={() => {
                          setEditingProduct(null);
                          setNewProduct({
                            name: "",
                            category: "Insumos De Pestañas",
                            price: "",
                            image_url: "",
                            stock: "",
                          });
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      className="btn"
                      style={{
                        marginTop: "1rem",
                        padding: "0.8rem 2.5rem",
                        borderRadius: "30px",
                        fontSize: "1rem",
                        background: "#333",
                        color: "#fff",
                      }}
                      type="submit"
                    >
                      {editingProduct
                        ? "✓ Guardar Cambios"
                        : " Guardar Producto"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mb-4">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "16px 0 0 16px", padding: "0.8rem 1rem" }}>
                    🔍
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Buscar producto por nombre o ID..."
                    style={{
                      marginBottom: "1rem",
                      border: "2px solid #f0f0f0",
                      borderRadius: "0 16px 16px 0",
                      padding: "0.8rem",
                      fontSize: "1rem",
                      boxShadow: "none"
                    }}
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.length > 0 ? (
                      currentProducts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <code style={{ fontSize: "0.85rem", color: "#666" }}>#{p.id}</code>
                          </td>
                          <td>
                            <strong>{p.name}</strong>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {p.category}
                            </span>
                          </td>
                          <td>${Number(p.price).toLocaleString("es-AR")}</td>
                          <td>{p.stock}</td>
                          <td>
                            {p.destacado ? (
                              <span className="badge bg-warning text-dark">
                                ✨ Destacado
                              </span>
                            ) : (
                              <span className="badge bg-light text-muted border">
                                Estándar
                              </span>
                            )}
                          </td>
                          <td className="text-center">
                            <button
                              className="btn-action-edit me-2"
                              onClick={() => handleEditClick(p)}
                              title="Editar"
                            >
                              Editar
                            </button>
                            <button
                              className="btn-action-delete"
                              onClick={() => handleDeleteProduct(p.id)}
                              title="Eliminar"
                            >
                              Borrar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          No se encontraron productos.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ marginTop: "20px" }}>
                  <button
                    className="btn btn-outline-dark btn-sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{ borderRadius: "10px", padding: "0.5rem 1rem" }}
                  >
                    Anterior
                  </button>
                  <span className="text-muted fw-bold">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-dark btn-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    style={{ borderRadius: "10px", padding: "0.5rem 1rem" }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "tips" && (
            <div>
              <div className="admin-card">
                <h4 className="mb-4">
                  {editingTip ? "Editar Tip" : "Agregar Nuevo Tip"}
                </h4>
                <form
                  onSubmit={editingTip ? handleUpdateTip : handleAddTip}
                  className="admin-form"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#555",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        Título del Tip
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        style={{
                          border: "2px solid #f0f0f0",
                          borderRadius: "16px",
                          padding: "1.2rem",
                          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                          fontSize: "1.1rem",
                        }}
                        name="title"
                        value={newTip.title}
                        onChange={handleTipInputChange}
                        placeholder="Ej. ¿Cómo cuidar tus extensiones?"
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#555",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        Contenido del Consejo
                      </label>
                      <textarea
                        className="form-control"
                        rows="5"
                        style={{
                          border: "2px solid #f0f0f0",
                          borderRadius: "16px",
                          padding: "1.2rem",
                          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                          fontSize: "1.1rem",
                        }}
                        name="content"
                        value={newTip.content}
                        onChange={handleTipInputChange}
                        placeholder="Escribe el consejo o tip detallado aquí..."
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-3 mt-4">
                    {editingTip && (
                      <button
                        type="button"
                        className="btn btn-outline-dark"
                        style={{
                          padding: "0.8rem 2.5rem",
                          borderRadius: "30px",
                          fontSize: "1rem",
                        }}
                        onClick={() => {
                          setEditingTip(null);
                          setNewTip({ title: "", content: "" });
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      className="btn"
                      style={{
                        padding: "0.8rem 2.5rem",
                        borderRadius: "30px",
                        fontSize: "1rem",
                        background: "#333",
                        color: "#fff",
                      }}
                      type="submit"
                    >
                      {editingTip ? "Guardar Cambios" : "Publicar Tip"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mb-4">
                <div className="input-group">
                  <span
                    className="input-group-text bg-white border-end-0"
                    style={{ borderRadius: "16px 0 0 16px", padding: "0.8rem 1rem" }}
                  >
                    🔍
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Buscar tip por título o ID..."
                    style={{
                      marginBottom: "1rem",
                      border: "2px solid #f0f0f0",
                      borderRadius: "0 16px 16px 0",
                      padding: "0.8rem",
                      fontSize: "1rem",
                      boxShadow: "none",
                    }}
                    value={tipSearchTerm}
                    onChange={(e) => setTipSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <h4
                className="mb-3 text-secondary"
                style={{ fontFamily: "var(--font-heading)", fontWeight: "700" }}
              >
                Lista de Tips Publicados
              </h4>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título del Tip</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTips.length > 0 ? (
                      currentTips.map((t) => (
                        <tr key={t.id}>
                          <td>#{t.id}</td>
                          <td>
                            <strong>{t.title}</strong>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn-action-edit me-2"
                              onClick={() => handleEditTipClick(t)}
                              title="Editar"
                            >
                              Editar
                            </button>
                            <button
                              className="btn-action-delete"
                              onClick={() => handleDeleteTip(t.id)}
                              title="Eliminar"
                            >
                              Borrar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">
                          No se encontraron tips.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls for Tips */}
              {totalTipPages > 1 && (
                <div style={{ marginTop: "20px" }}>
                  <button
                    className="btn btn-outline-dark btn-sm"
                    disabled={currentTipPage === 1}
                    onClick={() => setCurrentTipPage((prev) => Math.max(prev - 1, 1))}
                    style={{ borderRadius: "10px", padding: "0.5rem 1rem" }}
                  >
                    Anterior
                  </button>
                  <span className="text-muted fw-bold mx-3">
                    Página {currentTipPage} de {totalTipPages}
                  </span>
                  <button
                    className="btn btn-outline-dark btn-sm"
                    disabled={currentTipPage === totalTipPages}
                    onClick={() =>
                      setCurrentTipPage((prev) => Math.min(prev + 1, totalTipPages))
                    }
                    style={{ borderRadius: "10px", padding: "0.5rem 1rem" }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
