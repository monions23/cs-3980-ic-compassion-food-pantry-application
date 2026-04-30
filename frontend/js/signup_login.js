const API_BASE = "http://127.0.0.1:8000";

// ==========================
// SAFE INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  setupLogin();
  setupSignup();
  setupForgotPassword();
});

// ==========================
// LOGIN
// ==========================
function setupLogin() {
  const form = document.getElementById("login-form");
  if (!form) return; // prevents crash

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("sign-in-email").value;
    const password = document.getElementById("sign-in-password").value;
    const msg = document.getElementById("msg");

    try {
      const res = await fetch(`${API_BASE}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!res.ok) {
        let errorMsg = "Login failed";

        try {
          const errData = await res.json();
          errorMsg = errData.detail || JSON.stringify(errData);
        } catch {
          errorMsg = await res.text();
        }

        msg.style.color = "red";
        msg.textContent = errorMsg;
        return;
      }

      // success
      msg.style.color = "green";
      msg.textContent = "Login successful!";

      const data = await res.json();

      localStorage.setItem("access_token", data.access_token);

      console.log("Token saved:", data.access_token); // debug

      window.location.href = "main-BasicUser.html";
    } catch (err) {
      console.error(err);
      msg.textContent = "Error logging in";
    }
  });
}

// ==========================
// SIGNUP
// ==========================
function setupSignup() {
  const form = document.getElementById("signup-form");
  if (!form) return; //  prevents crash

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("sign-up-email").value;
    const password = document.getElementById("sign-up-password").value;
    const msg = document.getElementById("msg");

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!res.ok) {
        let errorMsg = "Signup failed";

        try {
          const errData = await res.json();
          errorMsg = errData.detail || JSON.stringify(errData);
        } catch {
          errorMsg = await res.text();
        }

        msg.style.color = "red";
        msg.textContent = errorMsg;
        return; // IMPORTANT
      }

      // only runs on success
      const data = await res.json();

      localStorage.setItem("access_token", data.access_token);

      console.log("Token saved:", data.access_token);

      window.location.href = "main-BasicUser.html";
    } catch (err) {
      console.error(err);
      msg.textContent = "Error signing up";
    }
  });
}

function setupForgotPassword() {
  const link = document.getElementById("forgotPasswordLink");
  const section = document.getElementById("forgotPasswordSection");

  if (!link || !section) return;

  // toggle UI
  link.addEventListener("click", (e) => {
    e.preventDefault();
    section.style.display =
      section.style.display === "block" ? "none" : "block";
  });

  // handle submit
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

async function submitReset(event) {
  event.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const res = await fetch("http://127.0.0.1:8000/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      new_password: newPassword
    })
  });

  let data;
  let text;

  const raw = await res.text();

  try {
    data = JSON.parse(raw);
  } catch {
    text = raw;
  }

  if (!res.ok) {
    alert(data?.detail || text || "Reset failed");
    return;
  }

  alert("Password updated!");
}
// // ==========================
// // REDIRECT LOGIC
// // ==========================
// function redirectBasedOnRole() {
//   const token = localStorage.getItem("access_token");

//   if (!token) {
//     window.location.href = "/main-logged-out.html";
//     return;
//   }

//   const user = parseJwt(token);

//   if (!user) {
//     window.location.href = "/main-logged-out.html";
//     return;
//   }

//   console.log("Decoded user:", user); //  debug

//   // IMPORTANT: adjust this depending on your backend payload
//   const role = user.role || user.sub_role || user.user_role;

//   if (role === "SuperAdmin") {
//     window.location.href = "main-admin.html";
//   } else if (role === "BasicUser") {
//     window.location.href = "main-BasicUser.html";
//   } else {
//     // fallback
//     window.location.href = "main-logged-out.html";
//   }
// }

// // ==========================
// // JWT PARSER (REQUIRED)
// // ==========================
// function parseJwt(token) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join(""),
//     );

//     return JSON.parse(jsonPayload);
//   } catch (e) {
//     console.error("Invalid token:", e);
//     return null;
//   }
// }
