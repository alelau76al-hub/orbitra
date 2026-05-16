export async function onRequestGet() {
  return Response.json(
    {
      success: false,
      message: 'Endpoint di test disabilitato.',
    },
    {
      status: 404,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
