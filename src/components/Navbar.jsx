import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import CartOffcanvas from "./CartOffcanvas";
import "./Navbar.css";

const AppNavbar = () => {
  const [showCart, setShowCart] = useState(false);
  const { cart, searchTerm, setSearchTerm } = useContext(AppContext);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            L.E Maquillaje
          </Link>

          <div className="nav-links">
            <Link to="/" className="nav-link">
              Inicio
            </Link>
            <Link to="/tips" className="nav-link">
              Tips
            </Link>
            <Link to="/admin" className="nav-link">
              Admin
            </Link>
          </div>

          <div className="nav-right">
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Buscar..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-success" type="submit">
                <FaSearch />
              </button>
            </form>

            <button
              className="btn btn-outline-primary position-relative"
              onClick={() => setShowCart(true)}
            >
              <FaShoppingCart />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      <CartOffcanvas show={showCart} handleClose={() => setShowCart(false)} />
    </>
  );
};

export default AppNavbar;
