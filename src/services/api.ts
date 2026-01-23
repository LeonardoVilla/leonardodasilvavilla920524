export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      options
    );

    if (!response.ok) {
      throw new ApiError(
        "Não foi possível comunicar com o servidor",
        response.status
      );
    }

    return response.json();
  } catch (error) {
    // 🔇 evita erro feio no console do usuário
    console.warn("Erro de comunicação com a API");
    throw new ApiError(
      "Servidor indisponível. Tente novamente mais tarde."
    );
  }
}
