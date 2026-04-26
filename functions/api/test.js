export async function onRequestGet() {
  return Response.json({
    success: true,
    message: "La Function Cloudflare funziona"
  })
}