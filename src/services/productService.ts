import type { Product } from '../types/product'

const PRODUCTS_URL = import.meta.env.VITE_PRODUCTS_URL || '/api/products'

function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'productName' in value &&
    typeof value.productName === 'string' &&
    'descriptionShort' in value &&
    typeof value.descriptionShort === 'string' &&
    'photo' in value &&
    typeof value.photo === 'string' &&
    'price' in value &&
    typeof value.price === 'number' &&
    Number.isSafeInteger(value.price) &&
    value.price >= 0
  )
}

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL, { signal })

  if (!response.ok) {
    throw new Error('Não foi possível carregar os produtos. Tente novamente.')
  }

  const data: unknown = await response.json()

  if (
    typeof data !== 'object' ||
    data === null ||
    !('success' in data) ||
    data.success !== true ||
    !('products' in data) ||
    !Array.isArray(data.products) ||
    !data.products.every(isProduct)
  ) {
    throw new Error('A resposta de produtos possui um formato inválido.')
  }

  return data.products
}
