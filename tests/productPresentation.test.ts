import { describe, expect, it } from 'vitest'
import { filterProducts } from '../src/utils/filterProducts'
import { formatPrice } from '../src/utils/formatPrice'
import { product } from './fixtures'

describe('apresentação dos produtos', () => {
  it('converte centavos sem multiplicar o preço por cem', () => {
    expect(formatPrice(149990)).toBe('R$\u00a01.499,90')
    expect(formatPrice(520)).toBe('R$\u00a05,20')
    expect(formatPrice(0)).toBe('R$\u00a00,00')
  })

  it('normaliza acentos, maiúsculas e espaços da busca', () => {
    expect(
      filterProducts([{ ...product, descriptionShort: 'Edição especial' }], '  EDICAO  '),
    ).toHaveLength(1)
  })

  it('não apresenta celulares como produtos de outras categorias', () => {
    expect(filterProducts([product], '', 'Celular')).toHaveLength(1)
    expect(filterProducts([product], '', 'Tablets')).toHaveLength(0)
    expect(filterProducts([product], '', 'Supermercado')).toHaveLength(0)
  })

  it('encontra celulares pelo tipo e pelo departamento', () => {
    for (const query of ['celular', 'celulares', 'smartphone', 'tecnologia', 'celular iphone']) {
      expect(filterProducts([product], query)).toEqual([product])
    }
    expect(filterProducts([product], 'celular samsung')).toHaveLength(0)
  })

  it('associa sinônimos à categoria correta e aceita palavras em outra ordem', () => {
    const tablet = { ...product, productName: 'iPad Air', descriptionShort: 'iPad Air' }
    expect(filterProducts([product, tablet], 'celular')).toEqual([product])
    expect(filterProducts([product, tablet], 'tablets')).toEqual([tablet])
    expect(filterProducts([product, tablet], 'tecnologia')).toHaveLength(2)
    expect(filterProducts([product], 'branco iphone')).toEqual([product])
  })
})
