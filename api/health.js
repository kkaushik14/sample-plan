export default function handler(request, response) {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.status(405).json({
      success: false,
      error: "Method not allowed"
    });
    return;
  }

  response.status(200).json({
    success: true,
    service: "sahara-vercel-api",
    status: "ok"
  });
}
