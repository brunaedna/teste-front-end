import { useId, useRef } from 'react'
import type { Product, ProductsState } from '../../types/product'
import { asset } from '../../utils/assets'
import { ProductCard } from '../ProductCard/ProductCard'
import './ProductShowcase.scss'

const categories = ['Celular', 'Acessórios', 'Tablets', 'Notebooks', 'TVs', 'Ver todos']

interface ProductShowcaseProps {
  state: ProductsState
  onRetry: () => void
  onSelect: (product: Product) => void
  category?: string
  onCategoryChange?: (category: string) => void
  id?: string
}

export function ProductShowcase({
  state,
  onRetry,
  onSelect,
  category,
  onCategoryChange,
  id,
}: ProductShowcaseProps) {
  const headingId = useId()
  const listRef = useRef<HTMLUListElement>(null)

  function scrollProducts(direction: number) {
    const list = listRef.current
    if (!list) return
    list.scrollBy({
      left: direction * list.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }

  return (
    <section className="product-showcase" id={id} aria-labelledby={headingId}>
      <div className="product-showcase__heading">
        <span aria-hidden="true">
          <img src={asset('section-line.svg')} alt="" />
        </span>
        <h2 id={headingId}>Produtos relacionados</h2>
        <span aria-hidden="true">
          <img src={asset('section-line.svg')} alt="" />
        </span>
      </div>
      {onCategoryChange ? (
        <div
          className="product-showcase__filters"
          role="group"
          aria-label="Filtrar produtos por categoria"
        >
          {categories.map((name) => (
            <button
              type="button"
              key={name}
              aria-pressed={category === name}
              onClick={() => {
                onCategoryChange(name)
                listRef.current?.scrollTo({ left: 0 })
              }}
            >
              {name}
            </button>
          ))}
        </div>
      ) : (
        <a href="#products" className="product-showcase__all">
          Ver todos
        </a>
      )}

      {state.status === 'loading' && (
        <p className="product-showcase__message" role="status">
          Carregando produtos…
        </p>
      )}
      {state.status === 'error' && (
        <div className="product-showcase__message">
          <p role="alert">{state.message}</p>
          <button className="button" type="button" onClick={onRetry}>
            Tentar novamente
          </button>
        </div>
      )}
      {state.status === 'success' &&
        (state.products.length === 0 ? (
          <p className="product-showcase__message" role="status">
            Nenhum produto encontrado para esta busca ou categoria.
          </p>
        ) : (
          <div className="product-showcase__carousel">
            <button
              type="button"
              className="product-showcase__arrow product-showcase__arrow--previous"
              aria-label="Produtos anteriores"
              onClick={() => scrollProducts(-1)}
            >
              <img src={asset('arrow-left.svg')} alt="" />
            </button>
            <ul
              ref={listRef}
              className="product-showcase__list"
              aria-label="Produtos disponíveis"
              tabIndex={0}
            >
              {state.products.map((product) => (
                <li key={product.productName}>
                  <ProductCard product={product} onSelect={onSelect} />
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="product-showcase__arrow product-showcase__arrow--next"
              aria-label="Próximos produtos"
              onClick={() => scrollProducts(1)}
            >
              <img src={asset('arrow-right.svg')} alt="" />
            </button>
          </div>
        ))}
    </section>
  )
}
