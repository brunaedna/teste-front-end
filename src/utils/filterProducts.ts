import type { Product } from '../types/product'

const categoryPatterns: Record<string, RegExp> = {
  Celular: /iphone|smartphone|celular/i,
  Acessórios: /acessorio|cabo|fone|carregador|capa/i,
  Tablets: /tablet|ipad/i,
  Notebooks: /notebook|laptop|macbook/i,
  TVs: /televisor|\btv\b/i,
}

const categorySearchTerms: Record<string, string> = {
  Celular: 'celular celulares smartphone smartphones telefone telefones',
  Acessórios: 'acessorio acessorios cabo cabos fone fones carregador carregadores capa capas',
  Tablets: 'tablet tablets',
  Notebooks: 'notebook notebooks laptop laptops',
  TVs: 'tv tvs televisor televisores televisao televisoes',
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function filterProducts(
  products: Product[],
  query: string,
  category = 'Ver todos',
): Product[] {
  const searchTerms = normalize(query.trim()).split(/\s+/).filter(Boolean)
  const pattern = categoryPatterns[category]

  return products.filter((product) => {
    const text = normalize(`${product.productName} ${product.descriptionShort}`)
    const matchesCategory = category === 'Ver todos' || (pattern?.test(text) ?? false)
    const matchedCategories = Object.keys(categoryPatterns).filter((name) =>
      categoryPatterns[name].test(text),
    )
    const searchableText = [
      text,
      ...matchedCategories.map((name) => categorySearchTerms[name]),
      matchedCategories.length > 0 ? 'tecnologia eletronico eletronicos' : '',
    ].join(' ')
    return matchesCategory && searchTerms.every((term) => searchableText.includes(term))
  })
}
