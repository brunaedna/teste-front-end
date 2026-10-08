import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { product } from './fixtures'

vi.mock('../src/hooks/useProducts', () => ({
  useProducts: () => ({ state: { status: 'success', products: [product] }, retry: vi.fn() }),
}))

describe('navegação principal', () => {
  it('troca o destaque, filtra departamentos e restaura os produtos', async () => {
    render(<App />)
    const user = userEvent.setup()
    const navigation = within(screen.getByRole('navigation', { name: 'Navegação principal' }))
    const offers = navigation.getByRole('link', { name: 'Ofertas do dia' })
    expect(offers).toHaveAttribute('aria-current', 'true')

    for (const department of ['Supermercado', 'Livros', 'Moda']) {
      const link = navigation.getByRole('link', { name: department })
      await user.click(link)
      expect(link).toHaveAttribute('aria-current', 'true')
      expect(offers).not.toHaveAttribute('aria-current')
      expect(screen.queryByRole('button', { name: `Comprar ${product.productName}` })).toBeNull()
      expect(
        screen.getAllByText('Nenhum produto encontrado para esta busca ou categoria.'),
      ).toHaveLength(3)
    }

    for (const label of ['Todas categorias', 'Lançamentos', 'Ofertas do dia']) {
      await user.click(navigation.getByRole('link', { name: label }))
      expect(navigation.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'true')
      expect(
        screen.getAllByRole('button', { name: `Comprar ${product.productName}` }),
      ).toHaveLength(3)
    }
  })

  it('limpa a busca ao escolher outra seção e mantém a assinatura na newsletter', async () => {
    render(<App />)
    const user = userEvent.setup()
    const navigation = within(screen.getByRole('navigation', { name: 'Navegação principal' }))
    const search = screen.getByRole('combobox', { name: 'Buscar produtos' })
    await user.type(search, 'sem correspondência')
    await user.click(navigation.getByRole('link', { name: 'Ofertas do dia' }))
    expect(search).toHaveValue('')
    expect(screen.getAllByRole('button', { name: `Comprar ${product.productName}` })).toHaveLength(
      3,
    )
    const subscription = navigation.getByRole('link', { name: 'Assinatura' })
    await user.click(subscription)
    expect(subscription).toHaveAttribute('href', '#newsletter')
    expect(subscription).toHaveAttribute('aria-current', 'true')
    expect(screen.getAllByRole('button', { name: `Comprar ${product.productName}` })).toHaveLength(
      3,
    )
  })
})
