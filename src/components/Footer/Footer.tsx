import { asset } from '../../utils/assets'
import './Footer.scss'

const columns = [
  { title: 'Institucional', links: ['Sobre Nós', 'Movimento', 'Trabalhe conosco'] },
  { title: 'Ajuda', links: ['Suporte', 'Fale Conosco', 'Perguntas Frequentes'] },
  {
    title: 'Termos',
    links: ['Termos e Condições', 'Política de Privacidade', 'Troca e Devolução'],
  },
]

interface FooterProps {
  onInformation: (title: string) => void
}

export function Footer({ onInformation }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="container footer__inner">
          <div className="footer__brand">
            <a href="#top" aria-label="Econverse, voltar ao início">
              <img src={asset('footer-logo.svg')} alt="Econverse" loading="lazy" />
            </a>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="footer__socials">
              {['Instagram', 'Facebook', 'LinkedIn'].map((social) => (
                <button
                  key={social}
                  type="button"
                  aria-label={social}
                  onClick={() => onInformation(social)}
                >
                  <img src={asset(`${social.toLowerCase()}.svg`)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
          <span className="footer__divider" aria-hidden="true">
            <img src={asset('footer-line.svg')} alt="" />
          </span>
          <nav className="footer__navigation" aria-label="Informações da loja">
            {columns.map(({ title, links }) => (
              <div className="footer__column" key={title}>
                <h2>{title}</h2>
                <ul>
                  {links.map((label) => (
                    <li key={label}>
                      <button type="button" onClick={() => onInformation(label)}>
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
      <p className="footer__copyright">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </footer>
  )
}
