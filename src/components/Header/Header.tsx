import type { Product, ProductsState } from '../../types/product'
import { asset } from '../../utils/assets'
import { ProductSearch } from '../ProductSearch/ProductSearch'
import './Header.scss'

interface HeaderProps {
  query: string
  onQueryChange: (value: string) => void
  onSearch: () => void
  onUtility: (title: string) => void
  cartCount: number
  productsState: ProductsState
  onSelectProduct: (product: Product) => void
  activeNavigation: string | null
  onNavigate: (item: string) => void
}

export function Header({
  query,
  onQueryChange,
  onSearch,
  onUtility,
  cartCount,
  productsState,
  onSelectProduct,
  activeNavigation,
  onNavigate,
}: HeaderProps) {
  return (
    <header className="header" id="top">
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      <div className="container">
        <ul className="header__benefits">
          <li>
            <img src={asset('shield.svg')} alt="" />
            <span>
              Compra <strong>100% segura</strong>
            </span>
          </li>
          <li>
            <img src={asset('truck.svg')} alt="" />
            <span>
              <strong>Frete grátis</strong> acima de R$ 200
            </span>
          </li>
          <li>
            <img src={asset('credit-card.svg')} alt="" />
            <span>
              <strong>Parcele</strong> suas compras
            </span>
          </li>
        </ul>
        <div className="header__main">
          <a href="#top" aria-label="Econverse, início">
            <img src={asset('logo.svg')} alt="Econverse" />
          </a>
          <ProductSearch
            query={query}
            state={productsState}
            onQueryChange={onQueryChange}
            onSearch={onSearch}
            onSelect={onSelectProduct}
          />
          <div className="header__actions">
            {['Meus pedidos', 'Favoritos', 'Minha conta', 'Carrinho'].map((label, index) => (
              <button
                type="button"
                key={label}
                aria-label={label === 'Carrinho' ? `Carrinho, ${cartCount} itens` : label}
                onClick={() => onUtility(label)}
              >
                <img
                  src={asset(['orders.svg', 'heart.svg', 'user.svg', 'cart.svg'][index])}
                  alt=""
                />
                {label === 'Carrinho' && cartCount > 0 && (
                  <span className="header__cart-count">{cartCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <nav className="header__navigation" aria-label="Navegação principal">
          {[
            ['Todas categorias', '#categories'],
            ['Supermercado', '#products'],
            ['Livros', '#products'],
            ['Moda', '#products'],
            ['Lançamentos', '#products'],
            ['Ofertas do dia', '#products'],
            ['Assinatura', '#newsletter'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              aria-current={activeNavigation === label ? 'true' : undefined}
              onClick={() => onNavigate(label)}
            >
              {label === 'Assinatura' && <img src={asset('crown.svg')} alt="" />}
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
