const API_BASE = "http://127.0.0.1:8000";

// ==========================
// SAFE INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  setupLogin();
  setupSignup();
  setupForgotPassword();

  // Autofill email after signup (nice UX)
  const savedEmail = localStorage.getItem("signup_email");
  if (savedEmail) {
    const emailInput = document.getElementById("sign-in-email");
    if (emailInput) emailInput.value = savedEmail;
    localStorage.removeItem("signup_email");
  }
});

// ==========================
// LOGIN
// ==========================
function setupLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation(); 

    console.log("LOGIN TRIGGERED"); // debug

    const email = document.getElementById("sign-in-email").value;
    const password = document.getElementById("sign-in-password").value;
    const msg = document.getElementById("login-msg");

    try {
      const res = await fetch(`${API_BASE}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        msg.className = "auth-message error";
        msg.textContent = data.detail || "Login failed";
        return;
      }

      // 🛑 HARD GUARD: no token = no redirect
      if (!data.access_token) {
        console.error("No token returned:", data);
        msg.className = "auth-message error";
        msg.textContent = "Login failed (no token)";
        return;
      }

      localStorage.setItem("access_token", data.access_token);

      msg.className = "auth-message success";
      msg.textContent = "Login successful!";

      window.location.href = "main-BasicUser.html";

    } catch (err) {
      console.error(err);
      msg.className = "auth-message error";
      msg.textContent = "Error logging in";
    }
  });
}

// ==========================
// SIGNUP
// ==========================
function setupSignup() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation(); // 🛑 prevents bubbling to other forms

    console.log("SIGNUP TRIGGERED"); // debug

    const email = document.getElementById("sign-up-email").value;
    const password = document.getElementById("sign-up-password").value;
    const msg = document.getElementById("signup-msg");

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        msg.className = "auth-message error";
        msg.textContent = data.detail || "Signup failed";
        return;
      }

      // ✅ IMPORTANT: DO NOT STORE TOKEN
      msg.className = "auth-message success";
      msg.textContent = "Account created! Please sign in.";

      // Autofill login
      document.getElementById("sign-in-email").value = email;

      // Clear signup form
      form.reset();

      // Focus login password
      document.getElementById("sign-in-password").focus();

    } catch (err) {
      console.error(err);
      msg.className = "auth-message error";
      msg.textContent = "Error signing up";
    }
  });
}

// ==========================
// FORGOT PASSWORD
// ==========================
function setupForgotPassword() {
  const link = document.getElementById("forgotPasswordLink");
  const section = document.getElementById("forgotPasswordSection");

  if (!link || !section) return;

  link.addEventListener("click", (e) => {
    e.preventDefault();
    section.style.display =
      section.style.display === "block" ? "none" : "block";
  });

  const form = section.querySelector("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("forgotEmail").value;
    const msg = document.getElementById("forgotMsg");

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        msg.style.color = "red";
        msg.textContent = data.detail || "Failed to send reset link";
        return;
      }

      msg.style.color = "green";
      msg.textContent = "If that email exists, a reset link was sent.";
    } catch (err) {
      console.error(err);
      msg.style.color = "red";
      msg.textContent = "Server error";
    }
  });
}