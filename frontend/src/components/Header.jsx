import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { items } = useContext(CartContext);
  const { user, signout } = useContext(AuthContext);
  const count = items.reduce((s, i) => s + (i.qty || 0), 0);
  const total = items.reduce((s, i) => s + (i.price * i.qty || 0), 0);

  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm">
      <div className="container">
        <h1 className="navbar-brand fw-bold m-0">
          <Link to="/" className="text-decoration-none">
            LivresGourmands
          </Link>
        </h1>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
          aria-controls="navMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Accueil
              </NavLink>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <NavLink to="/listes/create" className="nav-link">
                    Créer liste de cadeaux
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/listes/access" className="nav-link">
                    Accéder liste de cadeaux
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/commandes" className="nav-link">
                    Mes commandes
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item me-3">
              <NavLink to="/cart" className="nav-link">
                <strong>MON PANIER</strong> {count} article(s){" "}
                {total.toFixed(2)} $
              </NavLink>
            </li>
            {user ? (
              <li className="nav-item">
                <button className="btn btn-outline-secondary" onClick={signout}>
                  Se déconnecter
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink to="/login" className="btn btn-primary">
                  Connexion
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
