const BASE_URL = "https://pet-manager-api.geia.vip/q/swagger-ui/";
// const BASE_URL = "https://pet-manager-api.geia.vip";

export async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        // throw new Error("Erro na API");

        const errorText = await response.text();
        console.error("Erro API:", response.status, errorText);
        throw new Error(`Erro ${response.status}`);
    }

    return response.json();
}
