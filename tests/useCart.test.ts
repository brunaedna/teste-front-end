import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCart } from '../src/hooks/useCart'
import { product } from './fixtures'

describe('useCart', () => {
  it('soma quantidades do mesmo produto sem duplicar a linha', () => {
    const { result } = renderHook(useCart)
    act(() => result.current.addItem(product, 2))
    act(() => result.current.addItem(product, 1))
    expect(result.current.items).toEqual([{ product, quantity: 3 }])
    expect(result.current.itemCount).toBe(3)
  })

  it('remove somente o produto escolhido e atualiza a contagem', () => {
    const otherProduct = { ...product, productName: 'IPHONE 13 MINI 5' }
    const { result } = renderHook(useCart)
    act(() => {
      result.current.addItem(product, 2)
      result.current.addItem(otherProduct, 1)
    })
    act(() => result.current.removeItem(product.productName))
    expect(result.current.items).toEqual([{ product: otherProduct, quantity: 1 }])
    expect(result.current.itemCount).toBe(1)
  })
})
