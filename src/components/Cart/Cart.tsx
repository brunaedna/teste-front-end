import type { CartItem } from '../../types/cart'
import { formatPrice } from '../../utils/formatPrice'
import './Cart.scss'

interface CartProps {
  items: CartItem[]
  onRemove: (productName: string) => void
}

export function Cart({ items, onRemove }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  return (
    <div className="cart">
      <h3>Seu carrinho</h3>
      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul>
            {items.map(({ product, quantity }) => (
              <li key={product.productName}>
                <div>
                  <strong>{product.productName}</strong>
                  <p>
                    {quantity} × {formatPrice(product.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(product.productName)}
                  aria-label={`Remover ${product.productName}`}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
          <p className="cart__total">Total: {formatPrice(total)}</p>
          <p className="cart__note">
            Carrinho demonstrativo. Nenhuma compra ou pagamento é realizado.
          </p>
        </>
      )}
    </div>
  )
}
