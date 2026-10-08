import { asset } from '../../utils/assets'
import './Brands.scss'

export function Brands() {
  return (
    <section className="container brands" id="brands" aria-labelledby="brands-heading">
      <h2 id="brands-heading">Navegue por marcas</h2>
      <ul>
        {[1, 2, 3, 4, 5].map((number) => (
          <li key={number}>
            <a href="#products" aria-label={`Ver produtos Econverse, marca ${number}`}>
              <img src={asset('brand-logo.svg')} alt="Econverse" loading="lazy" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
