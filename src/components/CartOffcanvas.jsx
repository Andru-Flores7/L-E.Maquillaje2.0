import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartOffcanvas = ({ show, handleClose }) => {
  const { cart, removeFromCart, clearCart, cartTotal, updateQuantity } =
    useContext(AppContext);
  const navigate = useNavigate();

  const handleEnviarPedido = () => {
    if (cart.length > 0) {
      handleClose();
      navigate("/checkout");
    }
  };

  return (
    <>
      <div
        className={`cart-overlay ${show ? "open" : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`cart-sidebar ${show ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Carrito de Compras</h3>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleClose}
          >
            X
          </button>
        </div>

        <div className="cart-body">
          {cart.length > 0 ? (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={item.image_url || "https://via.placeholder.com/50"}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "4px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: "bold" }}>{item.name}</div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            style={{ padding: "0 8px", lineHeight: "1.2" }}
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            -
                          </button>
                          <span
                            style={{
                              width: "20px",
                              textAlign: "center",
                              fontSize: "0.9rem",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            style={{ padding: "0 8px", lineHeight: "1.2" }}
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <div
                          style={{
                            color: "#6c757d",
                            fontSize: "0.85rem",
                            marginTop: "4px",
                          }}
                        >
                          Precio unitario: ${item.price}
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              <div
                className="mt-4"
                style={{ borderTop: "1px solid #dee2e6", paddingTop: "1rem" }}
              >
                <div className="d-flex justify-content-between mb-3">
                  <h5>Total:</h5>
                  <h5>${cartTotal.toFixed(2)}</h5>
                </div>
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-success w-100"
                    onClick={handleEnviarPedido}
                  >
                    Enviar Pedido
                  </button>
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={clearCart}
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center mt-5">
              <p style={{ color: "#6c757d" }}>Tu carrito está vacío.</p>
              <button className="btn btn-primary" onClick={handleClose}>
                Seguir Comprando
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartOffcanvas;
