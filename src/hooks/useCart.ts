import { useState } from 'react'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(product: Product, quantity: number) {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.product.productName === product.productName)
      if (!existing) return [...currentItems, { product, quantity }]

      return currentItems.map((item) =>
        item === existing ? { ...item, quantity: item.quantity + quantity } : item,
      )
    })
  }

  function removeItem(productName: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.productName !== productName),
    )
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return { items, itemCount, addItem, removeItem }
}
