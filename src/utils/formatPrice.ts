const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatPrice(priceInCents: number): string {
  return currencyFormatter.format(priceInCents / 100)
}
