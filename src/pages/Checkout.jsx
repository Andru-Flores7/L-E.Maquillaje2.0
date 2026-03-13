import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
    telefono: "",
  });

  // Reemplazar este número con el número de WhatsApp real (código de país + código de área + número)
  const WHATSAPP_NUMBER = "543884636451";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error(
        "Tu carrito está vacío. Agrega productos antes de realizar el pedido.",
      );
      navigate("/");
      return;
    }

    // Construir mensaje de WhatsApp
    let mensaje = `*NUEVO PEDIDO*\n\n`;
    mensaje += `*DATOS DEL CLIENTE:*\n`;
    mensaje += `- Nombre: ${formData.nombre} ${formData.apellido}\n`;
    mensaje += `- Dirección: ${formData.direccion}\n`;
    mensaje += `- Email: ${formData.email}\n`;
    mensaje += `- Teléfono: ${formData.telefono}\n\n`;

    mensaje += `*DETALLE DEL PEDIDO:*\n`;
    cart.forEach((item) => {
      mensaje += `- ${item.quantity}x ${item.name} ($${item.price} c/u) = $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    mensaje += `\n*TOTAL:* $${cartTotal.toFixed(2)}`;

    // Redirigir a WhatsApp
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    toast.success("Pedido enviado a WhatsApp", {
      position: "top-center",
    });

    // Opcional: limpiar el carrito después de enviar
    clearCart();
    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>No tienes productos en tu carrito.</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "10px" }}
          >
            <div className="card-body p-4">
              <h2 className="mb-4 text-center" style={{ fontWeight: 600 }}>
                Finalizar Pedido
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingNombre"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                      />
                      <label
                        htmlFor="floatingNombre"
                        style={{ fontWeight: 500, color: "#6c757d" }}
                      >
                        Nombre <span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingApellido"
                        name="apellido"
                        placeholder="Apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                      />
                      <label
                        htmlFor="floatingApellido"
                        style={{ fontWeight: 500, color: "#6c757d" }}
                      >
                        Apellido <span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-floating mt-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <label
                    htmlFor="floatingEmail"
                    style={{ fontWeight: 500, color: "#6c757d" }}
                  >
                    Correo Electrónico <span className="text-danger">*</span>
                  </label>
                </div>

                <div className="form-floating mt-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingDireccion"
                    name="direccion"
                    placeholder="Dirección de Entrega"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required
                  />
                  <label
                    htmlFor="floatingDireccion"
                    style={{ fontWeight: 500, color: "#6c757d" }}
                  >
                    Dirección de Entrega <span className="text-danger">*</span>
                  </label>
                </div>

                <div className="form-floating mt-3">
                  <input
                    type="tel"
                    className="form-control"
                    id="floatingTelefono"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                  />
                  <label
                    htmlFor="floatingTelefono"
                    style={{ fontWeight: 500, color: "#6c757d" }}
                  >
                    Teléfono <span className="text-danger">*</span>
                  </label>
                </div>

                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mb-0">Total a pagar:</h5>
                    <h5 className="mb-0 text-success">
                      ${cartTotal.toFixed(2)}
                    </h5>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 py-3"
                    style={{ fontWeight: 600, fontSize: "1.1rem" }}
                  >
                    Enviar Pedido por WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
