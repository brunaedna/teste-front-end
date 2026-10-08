import { useState } from 'react'
import type { FormEvent } from 'react'
import './Newsletter.scss'

export function Newsletter() {
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Formulário validado. Este cadastro é demonstrativo; nenhum dado foi enviado.')
    event.currentTarget.reset()
  }

  return (
    <section id="newsletter" className="newsletter" aria-labelledby="newsletter-heading">
      <div className="container newsletter__inner">
        <div className="newsletter__text">
          <h2 id="newsletter-heading">Inscreva-se na nossa newsletter</h2>
          <p>
            Assine a nossa newsletter e receba as novidades e conteúdos exclusivos da Econverse.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="newsletter__fields">
            <label>
              <span className="visually-hidden">Nome</span>
              <input
                type="text"
                name="name"
                placeholder="Digite seu nome"
                autoComplete="given-name"
                required
                minLength={2}
              />
            </label>
            <label>
              <span className="visually-hidden">E-mail</span>
              <input
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                autoComplete="email"
                required
              />
            </label>
            <button type="submit" className="button button--yellow">
              Inscrever
            </button>
          </div>
          <label className="newsletter__consent">
            <input type="checkbox" name="consent" required />
            Aceito os termos e condições
          </label>
          {message && (
            <p role="status" className="newsletter__feedback">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
