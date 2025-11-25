import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listOuvrages } from "../services/ouvrageService";
import { createListe } from "../services/listeService";

export default function CreateList() {
    const [nom, setNom] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await listOuvrages();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data && Array.isArray(data.ouvrages)) {
                    setProducts(data.ouvrages);
                }
            } catch (e) {
                console.error("Erreur chargement produits:", e);
            }
        };
        fetchProducts();
    }, []);

    const handleQuantityChange = (productId, qty) => {
        setSelectedProducts((prev) => {
            if (qty <= 0) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: qty };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const items = Object.entries(selectedProducts).map(([id, qty]) => ({
            ouvrage_id: parseInt(id),
            quantite_souhaitee: parseInt(qty),
        }));

        if (items.length === 0) {
            setError("Veuillez sélectionner au moins un article.");
            setLoading(false);
            return;
        }

        try {
            const res = await createListe({ nom, items });
            alert(`Liste créée avec succès! Code: ${res.liste.code_partage}`);
            navigate("/listes/access");
        } catch (e) {
            setError(e.response?.data?.message || "Erreur lors de la création de la liste");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Créer une liste de cadeaux</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nom de la liste</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                </div>

                <h4 className="mt-4 mb-3">Sélectionner des articles</h4>
                <div className="row g-3" style={{ maxHeight: "500px", overflowY: "auto" }}>
                    {products.map((p) => (
                        <div className="col-md-6 col-lg-4" key={p.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title">{p.titre}</h6>
                                    <p className="small text-muted">{p.auteur}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <span>{Number(p.prix).toFixed(2)} $</span>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control form-control-sm w-50"
                                            placeholder="Qté"
                                            value={selectedProducts[p.id] || ""}
                                            onChange={(e) => handleQuantityChange(p.id, parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? "Création..." : "Créer ma liste"}
                    </button>
                </div>
            </form>
        </div>
    );
}
