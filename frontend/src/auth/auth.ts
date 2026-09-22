const TOKEN_KEY = "omni_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// Recarga la pagina a proposito (en vez de usar useNavigate) para que toda
// la app arranque de cero con el estado de sesion limpio, sin dejar datos
// de la sesion anterior dando vueltas en memoria.
export function logout() {
  clearToken();
  window.location.href = "/login";
}
