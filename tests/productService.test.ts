import { describe, expect, it, vi } from 'vitest'
import { getProducts } from '../src/services/productService'
import { product } from './fixtures'

describe('getProducts', () => {
  it('retorna os produtos validados e encaminha o sinal de cancelamento', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ success: true, products: [product] })))
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()
    await expect(getProducts(controller.signal)).resolves.toEqual([product])
    expect(fetchMock).toHaveBeenCalledWith('/api/products', { signal: controller.signal })
  })

  it('aceita uma lista vazia bem formada', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, products: [] }))),
    )
    await expect(getProducts()).resolves.toEqual([])
  })

  it('rejeita erros HTTP', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })))
    await expect(getProducts()).rejects.toThrow('Não foi possível carregar os produtos')
  })

  it.each([
    { success: false, products: [product] },
    { success: true, products: [{}] },
    { success: true, products: [{ ...product, price: -1 }] },
    { success: true, products: [{ ...product, price: 1.5 }] },
    { success: true, products: null },
  ])('rejeita dados inválidos: %j', async (payload) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(payload))))
    await expect(getProducts()).rejects.toThrow('formato inválido')
  })
})
