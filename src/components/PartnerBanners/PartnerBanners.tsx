import { asset } from '../../utils/assets'
import './PartnerBanners.scss'

export function PartnerBanners() {
  return (
    <section className="container partner-banners" aria-label="Parceiros Econverse">
      {[1, 2].map((number) => (
        <article className="partner-banners__card" key={number}>
          <img
            src={asset('partners.png')}
            className="partner-banners__image"
            alt="Loja de produtos de tecnologia"
            width="634"
            height="350"
            loading="lazy"
          />
          <div className="partner-banners__content">
            <h2>Parceiros</h2>
            <p>
              Lorem ipsum dolor sit
              <br /> amet, consectetur
            </p>
            <a className="button button--yellow" href="#brands">
              Confira
            </a>
          </div>
        </article>
      ))}
    </section>
  )
}
