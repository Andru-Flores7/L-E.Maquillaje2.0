import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "./Tips.css";

const Tips = () => {
  const { tips, loading } = useContext(AppContext);

  // In a real app, tips would be fetched via context/Supabase
  // For now, using mock if empty
  const displayTips =
    tips.length > 0
      ? tips
      : [
          {
            id: 1,
            title: "Cuidado de Pestañas",
            tip: "Evita usar rímel a prueba de agua en extensiones.",
            author: "Admin",
          },
          {
            id: 2,
            title: "Rutina de Noche",
            tip:
              "Lava tu cara antes de dormir para evitar poros obstruidos.",
            author: "Admin",
          },
        ];

  if (loading) return <div className="loading-state">Cargando tips...</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Tips de Belleza</h2>
      <div className="tips-container">
        {displayTips.map((tip) => (
          <div key={tip.id} className="tip-card">
            <h3 className="tip-title">{tip.title}</h3>
            <p className="tip-content">{tip.tip}</p>
            <footer className="tip-footer">
              Publicado por <cite>{tip.author || "Admin"}</cite>
            </footer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tips;
