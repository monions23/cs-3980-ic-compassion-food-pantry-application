const API_BASE = "http://127.0.0.1:8000";

// ==========================
// SAFE INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  setupLogin();
  setupSignup();
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
          errorMsg = errData.detail || errorMsg;
        } catch { }

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
        msg.textContent = "Signup failed";
        let errorMsg = "Signup failed";

        try {
          const errData = await res.json();
          errorMsg = errData.detail || errorMsg;
        } catch { }

        msg.textContent = errorMsg;
      }

      const data = await res.json();

      localStorage.setItem("access_token", data.access_token);

      console.log("Token saved:", data.access_token); // debug

      window.location.href = "main-BasicUser.html";
    } catch (err) {
      console.error(err);
      msg.textContent = "Error signing up";
    }
  });
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
