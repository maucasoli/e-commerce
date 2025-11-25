import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listOuvrages } from "../services/ouvrageService";
import { listCategories } from "../services/categorieService";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Charger les catégories une seule fois
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await listCategories();
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
      } catch (e) {
        console.error("Erreur chargement catégories:", e);
      }
    };
    fetchCategories();
  }, []);

  // Recherche avec debounce pour éviter trop de requêtes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search && search.trim()) {
          params.search = search.trim();
        }
        if (selectedCategory) {
          params.categorie = selectedCategory;
        }

        const productsData = await listOuvrages(params);

        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else if (productsData && Array.isArray(productsData.ouvrages)) {
          setProducts(productsData.ouvrages);
        } else {
          setProducts([]);
        }
      } catch (e) {
        console.error("Erreur recherche:", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce: attendre 500ms après la dernière frappe
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, selectedCategory]);

  return (
    <div className="container">
      {/* Carrousel */}
      <div
        id="carouselExample"
        className="carousel slide mb-4"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div
              className="bg-primary text-white p-5 text-center rounded"
              style={{ minHeight: "200px" }}
            >
              <h2>Bienvenue sur LivresGourmands.net</h2>
              <p className="lead">Découvrez notre sélection de livres</p>
            </div>
          </div>
          <div className="carousel-item">
            <div
              className="bg-success text-white p-5 text-center rounded"
              style={{ minHeight: "200px" }}
            >
              <h2>Livres pour tous les goûts</h2>
              <p className="lead">Explorez nos différentes catégories</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Recherche simple */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Recherche simple</h5>
          <div className="row g-3">
            {/* Input de recherche */}
            <div className="col-md-6">
              <label htmlFor="searchInput" className="form-label">
                Titre, auteur ou ISBN
              </label>
              <input
                id="searchInput"
                className="form-control"
                placeholder="Rechercher par titre, auteur ou ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Select de catégories */}
            <div className="col-md-6">
              <label htmlFor="categorySelect" className="form-label">
                Catégorie
              </label>
              <select
                id="categorySelect"
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recherche avancee */}
          <div className="mt-3">
            <Link to="/recherche-avancee" className="btn btn-outline-primary">
              Recherche avancée
            </Link>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <h2 className="mb-3">
        {search || selectedCategory
          ? "Résultats de la recherche"
          : "Nos ouvrages"}
      </h2>
      <p className="text-muted mb-3">
        Cliquer sur une image pour accéder à la description détaillée de
        l'ouvrage et commander
      </p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {(!Array.isArray(products) || products.length === 0) && (
            <div className="col-12">
              <div className="alert alert-info">Aucun ouvrage trouvé.</div>
            </div>
          )}

          {Array.isArray(products) &&
            products.map((p) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
