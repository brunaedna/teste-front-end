import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProductSearch } from '../src/components/ProductSearch/ProductSearch'
import type { ProductsState } from '../src/types/product'
import { product } from './fixtures'

const products = Array.from({ length: 8 }, (_, index) => ({
  ...product,
  productName: `IPHONE ${index + 1}`,
}))

function setup(state: ProductsState = { status: 'success', products }) {
  const onSelect = vi.fn()
  const onSearch = vi.fn()
  function Example() {
    const [query, setQuery] = useState('')
    return (
      <>
        <ProductSearch
          query={query}
          state={state}
          onQueryChange={setQuery}
          onSearch={onSearch}
          onSelect={onSelect}
        />
        <button>Fora da busca</button>
      </>
    )
  }
  render(<Example />)
  return {
    user: userEvent.setup(),
    input: screen.getByRole('combobox', { name: 'Buscar produtos' }),
    onSelect,
    onSearch,
  }
}

describe('sugestões de busca', () => {
  it('mostra até cinco produtos e abre o produto clicado', async () => {
    const { user, input, onSelect } = setup()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    await user.type(input, 'iphone')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('option')).toHaveLength(5)
    expect(screen.getByRole('status')).toHaveTextContent('8 produtos encontrados')
    await user.click(screen.getAllByRole('option')[1])
    expect(onSelect).toHaveBeenCalledWith(products[1])
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('permite escolher com setas e Enter e fechar com Escape', async () => {
    const { user, input, onSelect, onSearch } = setup()
    await user.type(input, 'iphone')
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    expect(onSelect).toHaveBeenCalledWith(products[1])
    expect(onSearch).not.toHaveBeenCalled()
    await user.keyboard('{ArrowUp}')
    expect(screen.getAllByRole('option')[4]).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{Escape}')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).toHaveFocus()
  })

  it('reconhece a categoria e permite pesquisar todos os resultados', async () => {
    const { user, input, onSearch } = setup()
    await user.type(input, 'celular')
    expect(screen.getAllByRole('option')).toHaveLength(5)
    await user.click(screen.getByRole('button', { name: 'Ver todos os resultados' }))
    expect(onSearch).toHaveBeenCalledOnce()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('informa a ausência de resultados e fecha ao sair da busca', async () => {
    const { user, input } = setup()
    await user.type(input, 'produto inexistente')
    expect(screen.getByRole('status')).toHaveTextContent('Nenhum produto encontrado')
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Fora da busca' }))
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it.each([
    [{ status: 'loading' }, 'Carregando sugestões'],
    [{ status: 'error', message: 'Falha na consulta' }, 'Sugestões indisponíveis'],
  ] as const)('informa o estado da consulta sem inventar produtos', async (state, message) => {
    const { user, input } = setup(state)
    await user.type(input, 'iphone')
    expect(screen.getByRole('status')).toHaveTextContent(message)
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })
})
