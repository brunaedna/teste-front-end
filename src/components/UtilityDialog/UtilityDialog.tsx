import type { CartItem } from '../../types/cart'
import { Cart } from '../Cart/Cart'
import { Dialog } from '../Dialog/Dialog'

const messages: Record<string, string> = {
  'Minha conta': 'Você está navegando como visitante.',
  'Meus pedidos': 'Você ainda não possui pedidos nesta demonstração.',
  Favoritos: 'Você ainda não possui favoritos nesta demonstração.',
}

interface UtilityDialogProps {
  title: string
  cartItems: CartItem[]
  onRemoveItem: (productName: string) => void
  onClose: () => void
}

export function UtilityDialog({ title, cartItems, onRemoveItem, onClose }: UtilityDialogProps) {
  return (
    <Dialog title={title} onClose={onClose}>
      {title === 'Carrinho' ? (
        <Cart items={cartItems} onRemove={onRemoveItem} />
      ) : (
        <div className="information">
          <h3>{title}</h3>
          <p>
            {messages[title] ??
              'Conteúdo demonstrativo. Consulte os canais oficiais da Econverse para obter informações institucionais atualizadas.'}
          </p>
        </div>
      )}
    </Dialog>
  )
}
