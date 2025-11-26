import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { createCommande, getCommandeById } from '../services/commandeService'
import { createPaymentIntent, confirmPayment } from '../services/paymentService'

// Initialiser Stripe (utiliser une variable d'environnement ou placeholder)
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
if (!stripePublicKey || stripePublicKey === 'pk_test_placeholder') {
  console.warn('⚠️ VITE_STRIPE_PUBLIC_KEY non définie ! Configurez-la dans le fichier .env')
}
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null

// Composant de formulaire de paiement
function CheckoutForm({ commandeId, total, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe non initialisé. Vérifiez la clé publique dans le fichier .env')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Créer PaymentIntent
      const { clientSecret, paymentIntentId } = await createPaymentIntent(commandeId)

      if (!clientSecret) {
        setError('Erreur : clientSecret non reçu du serveur. Vérifiez les clés Stripe dans le backend.')
        setLoading(false)
        return
      }

      // Confirmer le paiement avec Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (stripeError) {
        setError(stripeError.message)
        setLoading(false)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirmer au backend
        await confirmPayment(paymentIntentId, commandeId)
        onSuccess()
      }
    } catch (err) {
      console.error('Erreur paiement:', err)
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Erreur lors du traitement du paiement'
      setError(errorMessage)
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-3">
        <label className="form-label"><strong>Type de carte bancaire</strong></label>
        <div className="border rounded p-3 bg-light">
          <CardElement options={cardElementOptions} />
        </div>
        <small className="text-muted">Cliquer sur le type de carte choisi</small>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <button
        className="btn btn-success w-100 btn-lg"
        type="submit"
        disabled={!stripe || loading}
      >
        {loading ? 'Traitement en cours...' : `Payer ${total.toFixed(2)} $`}
      </button>
      <p className="text-muted mt-3 small">
        <strong>Test Succès:</strong> 4242 4242 4242 4242, n'importe quelle date future, n'importe quel CVC
      </p>
      <p className="text-muted mt-3 small">
        <strong>Test Refusé:</strong> 4000 0000 0000 0002
      </p>
    </form>
  )
}

// Composant principal
export default function Checkout() {
  const { items: cartItems, total: cartTotal, syncCart, clear } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [commandeId, setCommandeId] = useState(null)
  const [error, setError] = useState(null)
  const [livraison, setLivraison] = useState({
    adresse: '',
    mode: 'standard'
  })

  // Nouvel état pour le paiement direct
  const [searchParams] = useSearchParams()
  const urlCommandeId = searchParams.get('commandeId')
  const [directItems, setDirectItems] = useState([])
  const [directTotal, setDirectTotal] = useState(0)

  const nav = useNavigate()

  // Déterminer quels articles/total utiliser
  const displayItems = urlCommandeId ? directItems : cartItems
  const displayTotal = urlCommandeId ? directTotal : cartTotal

  useEffect(() => {
    if (!user) {
      nav('/login')
      return
    }

    const fetchDirectOrder = async () => {
      if (urlCommandeId) {
        try {
          setLoading(true)
          const data = await getCommandeById(urlCommandeId)
          // Transformer les articles pour correspondre au format d'affichage si nécessaire
          const mappedItems = data.items.map(i => ({
            id: i.id, // ou i.ouvrage_id selon ce dont nous avons besoin
            title: i.titre,
            qty: i.quantite,
            price: Number(i.prix_unitaire)
          }))
          setDirectItems(mappedItems)
          setDirectTotal(Number(data.commande.total))
        } catch (e) {
          setError("Erreur lors du chargement de la commande")
        } finally {
          setLoading(false)
        }
      } else if (cartItems.length === 0) {
        nav('/cart')
      }
    }

    fetchDirectOrder()
  }, [user, cartItems, nav, urlCommandeId])

  const handleCreateCommande = async () => {
    try {
      setLoading(true)
      setError(null)

      if (urlCommandeId) {
        // Paiement direct : procéder directement au paiement
        setCommandeId(urlCommandeId)
        // TODO: Mettre à jour la commande avec l'adresse si l'API le supportait
      } else {
        // Paiement normal du panier
        await syncCart()
        const res = await createCommande({})
        setCommandeId(res.commandeId)
        // TODO: Mettre à jour la commande avec l'adresse et le mode
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Erreur lors de la création de la commande')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    if (!urlCommandeId) {
      clear() // Vider le panier seulement si c'était un paiement depuis le panier
    }
    nav('/commandes')
  }

  if (!commandeId) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <h2 className="mb-4">Choix des modes de livraison et de règlement</h2>

            <div className="row g-4">
              <div className="col-md-8">
                {/* Livraison */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">Livraison</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Adresse de livraison</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={livraison.adresse}
                        onChange={(e) => setLivraison({ ...livraison, adresse: e.target.value })}
                        placeholder="Saisissez votre adresse complète"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Type d'envoi</label>
                      <select
                        className="form-select"
                        value={livraison.mode}
                        onChange={(e) => setLivraison({ ...livraison, mode: e.target.value })}
                      >
                        <option value="standard">Standard (5-7 jours)</option>
                        <option value="express">Express (2-3 jours)</option>
                        <option value="rapide">Rapide (24h)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Résumé commande */}
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Résumé de la commande</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      {displayItems.map(item => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between">
                          <span>{item.title} x {item.qty}</span>
                          <strong>{(item.price * item.qty).toFixed(2)} $</strong>
                        </li>
                      ))}
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>Total TTC:</strong>
                        <strong className="text-primary fs-5">{displayTotal.toFixed(2)} $</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <button
                      className="btn btn-primary w-100 btn-lg"
                      onClick={handleCreateCommande}
                      disabled={loading || !livraison.adresse}
                    >
                      {loading ? 'Chargement...' : 'Continuer vers le paiement'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <h2 className="mb-4">Règlement</h2>
          <div className="card p-4">
            <div className="mb-3">
              <h5>Total à payer: <strong className="text-primary">{displayTotal.toFixed(2)} $</strong></h5>
            </div>
            <div className="mb-3">
              <p className="text-muted">Sélectionnez votre mode de paiement</p>
            </div>
            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm commandeId={commandeId} total={displayTotal} onSuccess={handlePaymentSuccess} />
              </Elements>
            ) : (
              <div className="alert alert-danger">
                <strong>Erreur de configuration Stripe</strong>
                <p className="mb-0">
                  La clé publique Stripe n'est pas configurée.
                  Veuillez ajouter <code>VITE_STRIPE_PUBLIC_KEY</code> dans le fichier <code>.env</code> du frontend et redémarrer le serveur.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
