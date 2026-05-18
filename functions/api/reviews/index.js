const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
      ...(init.headers || {}),
    },
  });

function tableMissing(error) {
  return String(error && error.message ? error.message : error || "").toLowerCase().includes("no such table");
}

function summarize(reviews) {
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / count : 0;
  return {
    count,
    average: Math.round(average * 10) / 10,
  };
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const productId = Number(url.searchParams.get("product_id"));
    const params = [];
    const where = ["active = 1", "status = 'approved'"];

    if (productId) {
      where.push("product_id = ?");
      params.push(productId);
    }

    const rows = await env.DB.prepare(
      `
        SELECT id, product_id, customer_name, rating, title, body, created_at
        FROM product_reviews
        WHERE ${where.join(" AND ")}
        ORDER BY created_at DESC, id DESC
        LIMIT 100
      `,
    )
      .bind(...params)
      .all();

    const reviews = rows.results || [];
    return json({ success: true, reviews, summary: summarize(reviews) });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: true, reviews: [], summary: { count: 0, average: 0 }, setup_required: true });
    }
    return json({ success: false, reviews: [], summary: { count: 0, average: 0 }, message: "Reviews non disponibili." }, { status: 200 });
  }
}
