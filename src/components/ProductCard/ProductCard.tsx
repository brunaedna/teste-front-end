import { useState } from 'react'
import type { Product } from '../../types/product'
import { formatPrice } from '../../utils/formatPrice'
import './ProductCard.scss'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  return (
    <article className="product-card">
      <button
        type="button"
        className="product-card__image"
        aria-label={`Ver detalhes de ${product.productName}`}
        onClick={() => onSelect(product)}
      >
        {imageFailed ? (
          <span>Imagem indisponível</span>
        ) : (
          <img
            src={product.photo}
            alt={product.productName}
            width="278"
            height="228"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        )}
      </button>
      <h3 className="product-card__name">
        <button type="button" onClick={() => onSelect(product)}>
          {product.productName}
        </button>
      </h3>
      <span className="product-card__previous" aria-hidden="true" />
      <p className="product-card__price">
        <span className="visually-hidden">Preço: </span>
        {formatPrice(product.price)}
      </p>
      <p className="product-card__installment">
        ou 2x de {formatPrice(Math.ceil(product.price / 2))} sem juros
      </p>
      <p className="product-card__shipping">
        {product.price > 20000 ? 'Frete grátis' : 'Consulte o frete'}
      </p>
      <button
        type="button"
        className="button product-card__buy"
        aria-label={`Comprar ${product.productName}`}
        onClick={() => onSelect(product)}
      >
        Comprar
      </button>
    </article>
  )
}
