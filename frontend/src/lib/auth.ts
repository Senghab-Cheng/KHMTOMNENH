export type UserRole = "BUYER" | "SUPPLIER" | "ADMIN";

export type AuthResponse = {
  token: string;
  tokenType: string;
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type ApiRecord = Record<string, unknown>;

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const session =
    typeof window === "undefined"
      ? null
      : (JSON.parse(localStorage.getItem("khmertrade.auth") ?? "null") as AuthResponse | null);
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (session?.token) headers.set("Authorization", `${session.tokenType} ${session.token}`);

  const response = await fetch(`${apiUrl}${path}`, { ...options, headers });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as ApiRecord).message)
        : "The request could not be completed.";
    throw new Error(message);
  }
  return body as T;
}

export function getSession(): AuthResponse | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem("khmertrade.auth");
  return value ? (JSON.parse(value) as AuthResponse) : null;
}

export function signOut() {
  localStorage.removeItem("khmertrade.auth");
  window.location.assign("/auth/signin");
}

export async function authenticate(
  endpoint: "login" | "register",
  payload: Record<string, unknown>,
): Promise<AuthResponse> {
  const response = await fetch(`${apiUrl}/api/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => ({}))) as {
    message?: string;
  } & Partial<AuthResponse>;

  if (!response.ok) {
    throw new Error(body.message ?? "Unable to complete the request.");
  }

  if (!body.token || !body.role) {
    throw new Error("The server returned an invalid authentication response.");
  }

  return body as AuthResponse;
}

export function saveSession(auth: AuthResponse) {
  localStorage.setItem("khmertrade.auth", JSON.stringify(auth));
}

export function dashboardForRole(role: UserRole) {
  return `/dashboard/${role.toLowerCase()}`;
}
