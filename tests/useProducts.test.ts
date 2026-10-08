import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useProducts } from '../src/hooks/useProducts'
import { product } from './fixtures'

describe('useProducts', () => {
  it('permite tentar novamente após uma falha de rede', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Network error'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, products: [product] })))
    vi.stubGlobal('fetch', fetchMock)
    const { result } = renderHook(useProducts)
    await waitFor(() => expect(result.current.state.status).toBe('error'))
    act(() => result.current.retry())
    await waitFor(() =>
      expect(result.current.state).toEqual({ status: 'success', products: [product] }),
    )
  })

  it('cancela a consulta quando o componente é desmontado', () => {
    const fetchMock = vi.fn().mockReturnValue(new Promise(() => {}))
    vi.stubGlobal('fetch', fetchMock)
    const { unmount } = renderHook(useProducts)
    const signal = fetchMock.mock.calls[0][1].signal as AbortSignal
    unmount()
    expect(signal.aborted).toBe(true)
  })
})
