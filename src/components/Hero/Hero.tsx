import { asset } from '../../utils/assets'
import './Hero.scss'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <img
        className="hero__image"
        src={asset('hero.png')}
        alt=""
        width="1440"
        height="390"
        fetchPriority="high"
      />
      <div className="container hero__content">
        <h1 id="hero-heading">
          Venha conhecer nossas
          <br className="hero__line-break" /> promoções
        </h1>
        <p>
          <strong>50% Off</strong> <span>nos produtos</span>
        </p>
        <a href="#products" className="button button--yellow">
          Ver produto
        </a>
      </div>
    </section>
  )
}
