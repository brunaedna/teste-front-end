import { asset } from '../../utils/assets'
import './Categories.scss'

const categories = [
  ['Tecnologia', 'technology.png'],
  ['Supermercado', 'supermarket.png'],
  ['Bebidas', 'drinks.png'],
  ['Ferramentas', 'tools.png'],
  ['Saúde', 'health.png'],
  ['Esportes e Fitness', 'sports.png'],
  ['Moda', 'fashion.png'],
] as const

interface CategoriesProps {
  activeCategory: string
  onSelect: (category: string) => void
}

export function Categories({ activeCategory, onSelect }: CategoriesProps) {
  return (
    <nav id="categories" className="categories" aria-label="Categorias de produtos">
      <ul>
        {categories.map(([name, image]) => (
          <li key={name}>
            <button
              type="button"
              aria-pressed={activeCategory === name}
              onClick={() => onSelect(name)}
            >
              <span className="categories__icon">
                <img
                  src={asset(image)}
                  alt=""
                  width={name === 'Moda' ? 63 : 61}
                  height={name === 'Moda' ? 63 : 61}
                  loading="lazy"
                />
              </span>
              <span>{name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
