import { useCallback, useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import type { ProductsState } from '../types/product'

export function useProducts() {
  const [state, setState] = useState<ProductsState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      setState({ status: 'loading' })

      try {
        const products = await getProducts(controller.signal)

        if (!controller.signal.aborted) {
          setState({ status: 'success', products })
        }
      } catch {
        if (!controller.signal.aborted) {
          setState({
            status: 'error',
            message: 'Não foi possível carregar os produtos. Tente novamente.',
          })
        }
      }
    }

    void loadProducts()

    return () => controller.abort()
  }, [attempt])

  return { state, retry }
}
