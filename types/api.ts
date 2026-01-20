// Tipos para respuestas de API generales
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Configuración de API de Oddo
export interface OdooApiConfig {
  baseUrl: string;
  database: string;
  username: string;
  password: string;
}

export interface OdooAuthResponse {
  uid: number;
  session_id: string;
  user_context: Record<string, unknown>;
}
