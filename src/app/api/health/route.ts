export async function GET() {
  try {
    return Response.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        environment: process.env.NODE_ENV,
        api: process.env.NEXT_PUBLIC_API_URL,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: "Health check failed",
      },
      { status: 503 }
    );
  }
}
