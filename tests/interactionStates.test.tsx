import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Newsletter } from '../src/components/Newsletter/Newsletter'
import { ProductCard } from '../src/components/ProductCard/ProductCard'
import { ProductModal } from '../src/components/ProductModal/ProductModal'
import { ProductShowcase } from '../src/components/ProductShowcase/ProductShowcase'
import { product } from './fixtures'

describe('estados da vitrine', () => {
  it('anuncia o carregamento sem exibir produtos antigos', () => {
    render(<ProductShowcase state={{ status: 'loading' }} onRetry={vi.fn()} onSelect={vi.fn()} />)
    expect(screen.getByRole('status')).toHaveTextContent('Carregando produtos')
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('oferece recuperação após erro e exibe os produtos quando a consulta volta', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const onSelect = vi.fn()
    const { rerender } = render(
      <ProductShowcase
        state={{ status: 'error', message: 'Não foi possível carregar os produtos.' }}
        onRetry={onRetry}
        onSelect={onSelect}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar')
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(onRetry).toHaveBeenCalledOnce()
    rerender(
      <ProductShowcase
        state={{ status: 'success', products: [product] }}
        onRetry={onRetry}
        onSelect={onSelect}
      />,
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: `Comprar ${product.productName}` }))
    expect(onSelect).toHaveBeenCalledWith(product)
  })

  it('informa a ausência de resultados sem oferecer um carrossel vazio', () => {
    render(
      <ProductShowcase
        state={{ status: 'success', products: [] }}
        onRetry={vi.fn()}
        onSelect={vi.fn()}
      />,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Nenhum produto encontrado')
    expect(screen.queryByRole('button', { name: 'Próximos produtos' })).not.toBeInTheDocument()
  })

  it('mantém o acesso ao produto quando a imagem falha', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<ProductCard product={product} onSelect={onSelect} />)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.getByText('Imagem indisponível')).toBeVisible()
    await user.click(screen.getByRole('button', { name: `Ver detalhes de ${product.productName}` }))
    expect(onSelect).toHaveBeenCalledWith(product)
  })
})

describe('validação da newsletter', () => {
  it('bloqueia dados vazios, e-mail inválido e ausência de aceite', async () => {
    const user = userEvent.setup()
    render(<Newsletter />)
    const submit = screen.getByRole('button', { name: 'Inscrever' })
    await user.click(submit)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    await user.type(screen.getByRole('textbox', { name: 'Nome' }), 'Pessoa')
    await user.type(screen.getByRole('textbox', { name: 'E-mail' }), 'email-invalido')
    await user.click(submit)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    await user.clear(screen.getByRole('textbox', { name: 'E-mail' }))
    await user.type(screen.getByRole('textbox', { name: 'E-mail' }), 'pessoa@example.com')
    await user.click(submit)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    await user.click(screen.getByRole('checkbox'))
    await user.click(submit)
    expect(screen.getByRole('status')).toHaveTextContent('nenhum dado foi enviado')
    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue('')
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })
})

describe('limites e falhas do modal', () => {
  it('limita a quantidade a 99 e permite voltar a 98', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    render(<ProductModal product={product} onClose={vi.fn()} onAddToCart={onAddToCart} />)
    const increase = screen.getByRole('button', { name: 'Aumentar quantidade' })
    for (let index = 1; index < 99; index += 1) await user.click(increase)
    expect(increase).toBeDisabled()
    expect(screen.getByLabelText('Quantidade', { exact: true })).toHaveTextContent('99')
    await user.click(screen.getByRole('button', { name: 'Diminuir quantidade' }))
    expect(increase).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Comprar' }))
    expect(onAddToCart).toHaveBeenCalledWith(product, 98)
  })

  it('mantém os dados e a compra disponíveis após falha da imagem', () => {
    render(<ProductModal product={product} onClose={vi.fn()} onAddToCart={vi.fn()} />)
    fireEvent.error(screen.getByRole('img', { name: product.productName }))
    expect(screen.getByText('Imagem indisponível')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Comprar' })).toBeEnabled()
    expect(screen.getByText(/R\$\s1\.499,90/)).toBeVisible()
  })
})
