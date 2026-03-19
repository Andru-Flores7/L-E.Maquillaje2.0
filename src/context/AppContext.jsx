import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Global search state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        try {
          if (!supabase) throw new Error("Supabase client not initialized");

          // Fetch products from 'productos'
          const { data: productsData, error: productsError } = await supabase
            .from("productos")
            .select("*");

          if (productsError) {
            console.error("Error fetching productos:", productsError);
            toast.error("Error al cargar productos");
          } else {
            const mappedProducts = (productsData || []).map((p) => ({
              id: p.id,
              name: p.nombre,
              category: p.categoria,
              price: p.precio,
              image_url: p.imagen,
              stock: p.stock,
              destacado: p.destacado || false,
            }));
            setProducts(mappedProducts);
          }

          // Fetch tips
          const { data: tipsData, error: tipsError } = await supabase
            .from("tips")
            .select("*");

          if (tipsError) {
            console.error("Error fetching tips:", tipsError);
            // If 'tips' fails, try 'consejos' as fallback just in case
            const { data: fallbackData, error: fallbackError } = await supabase
              .from("consejos")
              .select("*");
            
            if (!fallbackError) {
              setTips(fallbackData || []);
            } else {
              toast.error("Error al cargar tips de la base de datos");
              setTips([]);
            }
          } else {
            console.log("Tips loaded:", tipsData?.length);
            setTips(tipsData || []);
          }
        } catch (error) {
          console.error("General error fetching data:", error);
          toast.error("Error de conexión con la base de datos");
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error("Outer error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const addProduct = async (product) => {
    try {
      const { data, error } = await supabase
        .from("productos")
        .insert([
          {
            nombre: product.name,
            categoria: product.category,
            precio: product.price,
            imagen: product.image_url,
            stock: product.stock || 0,
            destacado: product.destacado || false,
          },
        ])
        .select();

      if (error) throw error;

      // Update local state
      const newProduct = {
        id: data[0].id,
        name: data[0].nombre,
        category: data[0].categoria,
        price: data[0].precio,
        image_url: data[0].imagen,
        stock: data[0].stock,
        destacado: data[0].destacado,
      };
      setProducts((prev) => [...prev, newProduct]);
      return { success: true };
    } catch (error) {
      console.error("Error adding product:", error);
      return { success: false, error };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase.from("productos").delete().eq("id", id);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, error };
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const { data, error } = await supabase
        .from("productos")
        .update({
          nombre: updatedData.name,
          categoria: updatedData.category,
          precio: updatedData.price,
          imagen: updatedData.image_url,
          stock: updatedData.stock,
          destacado: updatedData.destacado,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      // Update local state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                name: data[0].nombre,
                category: data[0].categoria,
                price: data[0].precio,
                image_url: data[0].imagen,
                stock: data[0].stock,
                destacado: data[0].destacado,
              }
            : p,
        ),
      );
      return { success: true };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, error };
    }
  };

  const addTip = async (tip) => {
    try {
      const { data, error } = await supabase
        .from("tips")
        .insert([{ title: tip.title, tip: tip.content }])
        .select();

      if (error) throw error;

      setTips((prev) => [...prev, data[0]]);
      return { success: true };
    } catch (error) {
      console.error("Error adding tip:", error);
      return { success: false, error };
    }
  };

  const deleteTip = async (id) => {
    try {
      const { error } = await supabase.from("tips").delete().eq("id", id);
      if (error) throw error;

      setTips((prev) => prev.filter((t) => t.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting tip:", error);
      return { success: false, error };
    }
  };

  const updateTip = async (id, updatedTip) => {
    try {
      const { data, error } = await supabase
        .from("tips")
        .update({ title: updatedTip.title, tip: updatedTip.content })
        .eq("id", id)
        .select();

      if (error) throw error;

      setTips((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data[0] } : t))
      );
      return { success: true };
    } catch (error) {
      console.error("Error updating tip:", error);
      return { success: false, error };
    }
  };

  // Cart Logic
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // Mostrar cartel de producto añadido con un diseño premium y animado
    toast.custom(
      (t) => (
        <div
          style={{
            animation: t.visible
              ? "enter 0.3s ease-out forwards"
              : "leave 0.3s ease-in forwards",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 105, 180, 0.2)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            borderRadius: "16px",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transform: t.visible ? "translateY(0)" : "translateY(-20px)",
            opacity: t.visible ? 1 : 0,
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              background: "#ffedf5",
              color: "var(--primary-color)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            🛍️
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontWeight: 700,
                color: "#333",
                fontSize: "0.95rem",
                fontFamily: "var(--font-heading)",
              }}
            >
              ¡Añadido al carrito!
            </span>
            <span
              style={{
                color: "#666",
                fontSize: "0.85rem",
                maxWidth: "200px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product.name}
            </span>
          </div>
        </div>
      ),
      { duration: 2500 },
    );
  };

  const updateQuantity = (id, change) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          // Si la cantidad baja de 1, podrías eliminarlo, o simplemente no dejar que baje de 1
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      });
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <AppContext.Provider
      value={{
        products,
        tips,
        loading,
        addProduct,
        deleteProduct,
        updateProduct,
        addTip,
        deleteTip,
        updateTip,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
