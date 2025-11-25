import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListeByCode, acheterDepuisListe } from "../services/listeService";

export default function AccessList() {
    const { code: urlCode } = useParams();
    const [code, setCode] = useState(urlCode || "");
    const [liste, setListe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [purchaseQuantities, setPurchaseQuantities] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (urlCode) {
            handleSearch(urlCode);
        }
    }, [urlCode]);

    const handleSearch = async (searchCode) => {
        if (!searchCode) return;
        setLoading(true);
        setError("");
        setListe(null);
        try {
            const data = await getListeByCode(searchCode);
            setListe(data);
        } catch (e) {
            setError("Liste introuvable ou erreur serveur.");
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (itemId, qty) => {
        setPurchaseQuantities((prev) => ({
            ...prev,
            [itemId]: qty,
        }));
    };

    const handleBuy = async () => {
        setLoading(true);
        setError("");

        const itemsToBuy = Object.entries(purchaseQuantities)
            .filter(([_, qty]) => qty > 0)
            .map(([itemId, qty]) => {
                // Find the original item to get ouvrage_id
                const item = liste.items.find(i => i.id === parseInt(itemId));
                return {
                    ouvrage_id: item.ouvrage_id,
                    quantite_souhaitee: parseInt(qty)
                };
            });

        if (itemsToBuy.length === 0) {
            setError("Veuillez sélectionner des articles à acheter.");
            setLoading(false);
            return;
        }

        try {
            const res = await acheterDepuisListe(liste.liste.code_partage, itemsToBuy);
            // alert("Commande effectuée avec succès!");
            // Redirect to checkout with commandeId
            navigate(`/checkout?commandeId=${res.commandeId}`);
        } catch (e) {
            setError(e.response?.data?.message || "Erreur lors de l'achat.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Accéder à une liste de cadeaux</h2>

            {!urlCode && (
                <div className="input-group mb-4 w-50">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Entrez le code de la liste"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSearch(code)}
                        disabled={loading}
                    >
                        Rechercher
                    </button>
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {liste && (
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h3 className="mb-0">{liste.liste.nom}</h3>
                    </div>
                    <div className="card-body">
                        <p className="text-muted">Code: <strong>{liste.liste.code_partage}</strong></p>

                        <h4 className="mt-4">Articles souhaités</h4>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Livre</th>
                                        <th>Prix</th>
                                        <th>Souhaité</th>
                                        <th>Déjà offert</th>
                                        <th>Offrir</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {liste.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="fw-bold">{item.titre}</div>
                                                <div className="small text-muted">{item.auteur}</div>
                                            </td>
                                            <td>{Number(item.prix).toFixed(2)} $</td>
                                            <td>{item.quantite_souhaitee}</td>
                                            <td>{item.quantite_achetee || 0}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={item.quantite_souhaitee - (item.quantite_achetee || 0)}
                                                    className="form-control form-control-sm w-50"
                                                    value={purchaseQuantities[item.id] || ""}
                                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                                                    disabled={(item.quantite_achetee || 0) >= item.quantite_souhaitee}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-3 text-end">
                            <button
                                className="btn btn-success btn-lg"
                                onClick={handleBuy}
                                disabled={loading}
                            >
                                {loading ? "Traitement..." : "Offrir les articles sélectionnés"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
