export const AUTH_SESSION_COOKIE = "aion_session";
const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 30;

export function extractCookieValue(cookieHeader: string | undefined, key: string) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((entry) => entry.trim());
  for (const entry of cookies) {
    const [name, ...valueParts] = entry.split("=");
    if (name === key) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

export function setAuthCookie(
  response: {
    cookie: (name: string, value: string, options: Record<string, unknown>) => void;
  },
  token: string
) {
  response.cookie(AUTH_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: ONE_MONTH_IN_SECONDS * 1000
  });
}

export function clearAuthCookie(
  response: {
    clearCookie: (name: string, options: Record<string, unknown>) => void;
  }
) {
  response.clearCookie(AUTH_SESSION_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });
}
