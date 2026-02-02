export async function GET() {
  try {
    return Response.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Health check failed",
      },
      { status: 503 }
    );
  }
}
