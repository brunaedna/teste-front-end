import { useState } from 'react'
import type { Product } from '../../types/product'
import { asset } from '../../utils/assets'
import { formatPrice } from '../../utils/formatPrice'
import { Dialog } from '../Dialog/Dialog'
import './ProductModal.scss'

interface ProductModalProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product, quantity: number) => void
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <Dialog title={product.productName} onClose={onClose} className="product-modal">
      <div className="product-modal__image">
        {imageFailed ? (
          <p>Imagem indisponível</p>
        ) : (
          <img
            src={product.photo}
            alt={product.productName}
            width="247"
            height="192"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
      <div className="product-modal__information">
        <h3>{product.productName}</h3>
        <p className="product-modal__price">{formatPrice(product.price)}</p>
        <p className="product-modal__description">{product.descriptionShort}</p>
        <button
          type="button"
          className="product-modal__details"
          aria-expanded={showDetails}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Ocultar detalhes do produto' : 'Veja mais detalhes do produto >'}
        </button>
        {showDetails && (
          <p className="product-modal__extra">
            {product.descriptionShort}. Preço unitário: {formatPrice(product.price)}.
          </p>
        )}
        <div className="product-modal__actions">
          <div className="product-modal__quantity" role="group" aria-label="Quantidade do produto">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              disabled={quantity === 1}
              onClick={() => {
                setQuantity(quantity - 1)
                setAdded(false)
              }}
            >
              <img src={asset('minus.svg')} alt="" />
            </button>
            <output aria-label="Quantidade" aria-live="polite">
              {String(quantity).padStart(2, '0')}
            </output>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              disabled={quantity === 99}
              onClick={() => {
                setQuantity(quantity + 1)
                setAdded(false)
              }}
            >
              <img src={asset('plus.svg')} alt="" />
            </button>
          </div>
          <button
            className="button button--yellow"
            type="button"
            onClick={() => {
              onAddToCart(product, quantity)
              setAdded(true)
            }}
          >
            Comprar
          </button>
        </div>
        {added && (
          <p className="product-modal__feedback" role="status">
            Produto adicionado ao carrinho.
          </p>
        )}
      </div>
    </Dialog>
  )
}
