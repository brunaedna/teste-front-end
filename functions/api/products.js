const PRODUCTS_URL =
  'https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json'

export async function onRequestGet() {
  try {
    const response = await fetch(PRODUCTS_URL)

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return Response.json(
      { success: false, message: 'Não foi possível carregar os produtos.' },
      { status: 502 },
    )
  }
}
