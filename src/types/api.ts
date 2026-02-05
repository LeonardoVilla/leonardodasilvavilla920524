// ===== AUTENTICAÇÃO =====
export interface AuthRequestDto {
  username: string;
  password: string;
}

export interface AuthResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

export type LoginResponse = AuthResponseDto;

// ===== ANEXOS =====
export interface AnexoResponseDto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

// ===== PETS =====
export interface PetRequestDto {
  nome: string;
  especie: string;
  raca?: string;
  idade?: number;
}

export interface PetResponseDto {
  id: number;
  nome: string;
  especie?: string;
  raca?: string;
  idade?: number;
  foto?: AnexoResponseDto;
}

export interface PetResponseCompletoDto {
  id: number;
  nome: string;
  especie?: string;
  raca?: string;
  idade?: number;
  foto?: AnexoResponseDto;
  tutores?: ProprietarioResponseDto[];
}

// ===== PROPRIETÁRIOS/TUTORES =====
export interface ProprietarioRequestDto {
  nome: string;
  email?: string;
  telefone: string;
  endereco?: string;
  cpf?: number;
}

export interface ProprietarioResponseDto {
  id: number;
  nome: string;
  email?: string;
  telefone: string;
  endereco?: string;
  cpf?: number;
  foto?: AnexoResponseDto;
}

export interface ProprietarioResponseComPetsDto {
  id: number;
  nome: string;
  email?: string;
  telefone: string;
  endereco?: string;
  cpf?: number;
  foto?: AnexoResponseDto;
  pets?: PetResponseDto[];
}

// ===== RESPOSTAS PAGINADAS =====
export interface PagedPetResponseDto {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: PetResponseDto[];
}

export interface PagedProprietarioResponseDto {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: ProprietarioResponseDto[];
}

// ===== ALIASES PARA COMPATIBILIDADE =====
export interface Paginated<T> {
  content: T[];
  page?: number;
  size?: number;
  total?: number;
  pageCount?: number;
  totalElements?: number;
  totalPages?: number;
  number?: number;
  [key: string]: unknown;
}