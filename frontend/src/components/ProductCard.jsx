import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <div className="card h-100">
      <img src={product.image || '/placeholder.png'} className="card-img-top product-image" alt={product.titre || product.title} />
      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{product.titre || product.title}</h6>
        <p className="card-text text-muted">{product.auteur || product.author}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <strong>{Number(product.prix ?? product.price ?? 0).toFixed(2)} $</strong>
          <Link to={`/ouvrages/${product.id}`} className="btn btn-sm btn-outline-primary">Details</Link>
        </div>
      </div>
    </div>
  )
}
