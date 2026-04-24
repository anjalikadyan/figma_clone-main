export type CanvasDocumentPayload = {
  title?: string;
  data?: Record<string, unknown>;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const makeRequest = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    });
  } catch (_error) {
    throw new Error("Cannot connect to API. Make sure backend is running on port 5000.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed (${response.status}).`);
  }

  return response.json() as Promise<T>;
};

export const signup = async (payload: {
  name: string;
  email: string;
  password: string;
}) =>
  makeRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const signin = async (payload: { email: string; password: string }) =>
  makeRequest<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const refreshSession = async () =>
  makeRequest<AuthResponse>("/auth/refresh", {
    method: "POST",
  });

export const logout = async () =>
  makeRequest<{ message: string }>("/auth/logout", {
    method: "POST",
  });

export const forgotPassword = async (payload: { email: string }) =>
  makeRequest<{ message: string; resetToken?: string; expiresInMinutes?: number }>(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

export const resetPassword = async (payload: { token: string; password: string }) =>
  makeRequest<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getCurrentUser = async () => makeRequest<{ user: AuthUser }>("/auth/me");

export const getDocument = async (roomId: string) => makeRequest(`/documents/${roomId}`);

export const saveDocument = async (
  roomId: string,
  payload: CanvasDocumentPayload
) =>
  makeRequest(`/documents/${roomId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const getAdminSummary = async () =>
  makeRequest<{ metrics: { usersCount: number; documentsCount: number; adminsCount: number } }>(
    "/admin/summary"
  );
