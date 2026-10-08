import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)

// JSDOM does not provide the browser's native modal dialog behavior.
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '')
  this.querySelector<HTMLElement>('[autofocus]')?.focus()
}

HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open')
}
