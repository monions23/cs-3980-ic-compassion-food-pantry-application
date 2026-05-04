const API_BASE = "http://127.0.0.1:8000";

/* ==========================
    LOG IN
========================== */
export const loginRequest = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username: email,
      password: password,
    }),
  });

  return res;
};

/* ==========================
    SIGN UP
========================== */
export const signupRequest = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res;
};

/* ==========================
    FORGOT PASSWORD
========================== */
export const forgotPassword = async (email) => {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return res;
};
