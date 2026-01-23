export interface Pet {
  id: number;
  nome: string;
}

/** Response returned by the authentication endpoint. */
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  /** Optional user metadata returned by the auth endpoint. */
  user?: {
    id?: number | string;
    nome?: string;
    email?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/** Common paginated response shape. */
export interface Paginated<T> {
  content: T[];
  /** Total number of elements available on the server (if provided). */
  totalElements?: number;
  /** Total pages available (if provided). */
  totalPages?: number;
  /** Current page number (0-based) */
  number?: number;
  /** Page size */
  size?: number;
  /** Convenience alias for totalElements */
  total?: number;
  [key: string]: unknown;
}