import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const productProxy = {
  '/api/products': {
    target: 'https://app.econverse.com.br',
    changeOrigin: true,
    rewrite: () => '/teste-front-end/junior/tecnologia/lista-produtos/produtos.json',
  },
}

export default defineConfig({
  plugins: [react()],
  server: { proxy: productProxy },
  preview: { proxy: productProxy },
})
