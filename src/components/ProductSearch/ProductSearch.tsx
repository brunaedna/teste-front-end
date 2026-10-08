import { useId, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import type { Product, ProductsState } from '../../types/product'
import { asset } from '../../utils/assets'
import { filterProducts } from '../../utils/filterProducts'
import { formatPrice } from '../../utils/formatPrice'
import './ProductSearch.scss'

interface ProductSearchProps {
  query: string
  state: ProductsState
  onQueryChange: (value: string) => void
  onSearch: () => void
  onSelect: (product: Product) => void
}

export function ProductSearch({
  query,
  state,
  onQueryChange,
  onSearch,
  onSelect,
}: ProductSearchProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const matches = state.status === 'success' ? filterProducts(state.products, query) : []
  const suggestions = matches.slice(0, 5)
  const expanded = open && query.trim().length >= 2
  const listId = `${id}-suggestions`

  function selectProduct(product: Product) {
    setOpen(false)
    setActiveIndex(-1)
    onSelect(product)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setOpen(false)
    setActiveIndex(-1)
    onSearch()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (query.trim().length < 2 || suggestions.length === 0) return
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => {
        if (!expanded || index < 0) return event.key === 'ArrowDown' ? 0 : suggestions.length - 1
        return (
          (index + (event.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length
        )
      })
    } else if (event.key === 'Enter' && expanded && suggestions[activeIndex]) {
      event.preventDefault()
      selectProduct(suggestions[activeIndex])
    }
  }

  return (
    <form
      className="product-search"
      role="search"
      aria-label="Busca de produtos"
      onSubmit={handleSubmit}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false)
          setActiveIndex(-1)
        }
      }}
    >
      <label className="visually-hidden" htmlFor={id}>
        Buscar produtos
      </label>
      <input
        id={id}
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={expanded ? listId : undefined}
        aria-activedescendant={
          expanded && suggestions[activeIndex] ? `${id}-option-${activeIndex}` : undefined
        }
        autoComplete="off"
        placeholder="O que você está buscando?"
        value={query}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        onChange={(event) => {
          onQueryChange(event.target.value)
          setOpen(true)
          setActiveIndex(-1)
        }}
      />
      <button className="product-search__submit" type="submit" aria-label="Buscar">
        <img src={asset('search.svg')} alt="" />
      </button>
      {expanded && (
        <div className="product-search__dropdown">
          <p className="product-search__heading">Sugestões de produtos</p>
          <ul id={listId} role="listbox" aria-label="Sugestões de produtos">
            {suggestions.map((product, index) => (
              <li
                id={`${id}-option-${index}`}
                key={product.productName}
                role="option"
                aria-selected={activeIndex === index}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectProduct(product)}
              >
                <img src={product.photo} alt="" width="48" height="48" />
                <span>
                  {product.productName}
                  <strong>{formatPrice(product.price)}</strong>
                </span>
              </li>
            ))}
          </ul>
          <p className="product-search__status" role="status">
            {state.status === 'loading'
              ? 'Carregando sugestões…'
              : state.status === 'error'
                ? 'Sugestões indisponíveis. Tente novamente na vitrine.'
                : matches.length === 0
                  ? 'Nenhum produto encontrado.'
                  : `${matches.length} produtos encontrados. Use as setas e Enter para escolher.`}
          </p>
          {matches.length > 0 && (
            <button className="product-search__all" type="submit">
              Ver todos os resultados
            </button>
          )}
        </div>
      )}
    </form>
  )
}
