import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProductModal } from '../src/components/ProductModal/ProductModal'
import { product } from './fixtures'

describe('ProductModal', () => {
  it('mostra os dados do produto e adiciona a quantidade selecionada', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    render(<ProductModal product={product} onClose={vi.fn()} onAddToCart={onAddToCart} />)
    expect(screen.getByRole('dialog', { name: product.productName })).toBeVisible()
    expect(screen.getByText(/R\$\s1\.499,90/)).toBeVisible()
    expect(screen.getByRole('button', { name: 'Diminuir quantidade' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade' }))
    expect(screen.getByLabelText('Quantidade', { exact: true })).toHaveTextContent('02')
    await user.click(screen.getByRole('button', { name: 'Comprar' }))
    expect(onAddToCart).toHaveBeenCalledWith(product, 2)
    expect(screen.getByText('Produto adicionado ao carrinho.')).toBeVisible()
  })

  it('não permite reduzir a quantidade abaixo de um', async () => {
    const user = userEvent.setup()
    render(<ProductModal product={product} onClose={vi.fn()} onAddToCart={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade' }))
    await user.click(screen.getByRole('button', { name: 'Diminuir quantidade' }))
    expect(screen.getByRole('button', { name: 'Diminuir quantidade' })).toBeDisabled()
    expect(screen.getByLabelText('Quantidade', { exact: true })).toHaveTextContent('01')
  })

  it('fecha pelo botão e devolve o foco ao elemento que abriu o modal', async () => {
    const user = userEvent.setup()
    function Example() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>Abrir produto</button>
          {open && (
            <ProductModal product={product} onClose={() => setOpen(false)} onAddToCart={vi.fn()} />
          )}
        </>
      )
    }
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Abrir produto' })
    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Fechar modal' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('trata o cancelamento nativo do diálogo e o clique no fundo', () => {
    const onClose = vi.fn()
    render(<ProductModal product={product} onClose={onClose} onAddToCart={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    fireEvent.click(dialog, { clientX: -1, clientY: -1 })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('mantém a navegação por Tab e Shift+Tab dentro do modal', async () => {
    const user = userEvent.setup()
    render(<ProductModal product={product} onClose={vi.fn()} onAddToCart={vi.fn()} />)
    const close = screen.getByRole('button', { name: 'Fechar modal' })
    const buy = screen.getByRole('button', { name: 'Comprar' })
    expect(close).toHaveFocus()
    await user.tab({ shift: true })
    expect(buy).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
  })
})
