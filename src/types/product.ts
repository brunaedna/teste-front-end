export interface Product {
  productName: string
  descriptionShort: string
  photo: string
  price: number
}

export type ProductsState =
  | { status: 'loading' }
  | { status: 'success'; products: Product[] }
  | { status: 'error'; message: string }
