import { useState } from 'react'
import { Brands } from './components/Brands/Brands'
import { Categories } from './components/Categories/Categories'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { Newsletter } from './components/Newsletter/Newsletter'
import { PartnerBanners } from './components/PartnerBanners/PartnerBanners'
import { ProductModal } from './components/ProductModal/ProductModal'
import { ProductShowcase } from './components/ProductShowcase/ProductShowcase'
import { UtilityDialog } from './components/UtilityDialog/UtilityDialog'
import { useCart } from './hooks/useCart'
import { useProducts } from './hooks/useProducts'
import type { Product, ProductsState } from './types/product'
import { filterProducts } from './utils/filterProducts'
import './App.scss'

export default function App() {
  const { state, retry } = useProducts()
  const cart = useCart()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Celular')
  const [department, setDepartment] = useState('Tecnologia')
  const [activeNavigation, setActiveNavigation] = useState<string | null>('Ofertas do dia')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [information, setInformation] = useState<string | null>(null)

  const displayState: ProductsState =
    state.status === 'success'
      ? {
          status: 'success',
          products: filterProducts(
            state.products,
            query,
            department === 'Tecnologia' ? category : department,
          ),
        }
      : state

  function scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }
  function selectDepartment(value: string) {
    setQuery('')
    setDepartment(value)
    setCategory('Ver todos')
    setActiveNavigation(['Supermercado', 'Moda'].includes(value) ? value : null)
    scrollToProducts()
  }
  function navigate(item: string) {
    setActiveNavigation(item)
    if (item === 'Assinatura') return
    setQuery('')
    setCategory('Ver todos')
    setDepartment(['Supermercado', 'Livros', 'Moda'].includes(item) ? item : 'Tecnologia')
  }
  function selectCategory(value: string) {
    setDepartment('Tecnologia')
    setCategory(value)
    setActiveNavigation(null)
  }

  function changeQuery(value: string) {
    setQuery(value)
    if (value.trim()) {
      setDepartment('Tecnologia')
      setCategory('Ver todos')
      setActiveNavigation(null)
    }
  }

  function searchProducts() {
    setDepartment('Tecnologia')
    setCategory('Ver todos')
    setActiveNavigation(null)
    scrollToProducts()
  }

  return (
    <>
      <Header
        query={query}
        onQueryChange={changeQuery}
        onSearch={searchProducts}
        productsState={state}
        onSelectProduct={setSelectedProduct}
        onUtility={setInformation}
        cartCount={cart.itemCount}
        activeNavigation={activeNavigation}
        onNavigate={navigate}
      />
      <main id="main">
        <Hero />
        <Categories activeCategory={department} onSelect={selectDepartment} />
        <ProductShowcase
          id="products"
          state={displayState}
          onRetry={retry}
          onSelect={setSelectedProduct}
          category={category}
          onCategoryChange={selectCategory}
        />
        <PartnerBanners />
        <ProductShowcase state={displayState} onRetry={retry} onSelect={setSelectedProduct} />
        <PartnerBanners />
        <Brands />
        <ProductShowcase state={displayState} onRetry={retry} onSelect={setSelectedProduct} />
        <Newsletter />
      </main>
      <Footer onInformation={setInformation} />
      {selectedProduct && (
        <ProductModal
          key={selectedProduct.productName}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={cart.addItem}
        />
      )}
      {information && (
        <UtilityDialog
          title={information}
          onClose={() => setInformation(null)}
          cartItems={cart.items}
          onRemoveItem={cart.removeItem}
        />
      )}
    </>
  )
}
