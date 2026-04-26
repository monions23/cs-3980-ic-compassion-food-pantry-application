const API_BASE = "http://127.0.0.1:8000";

document.getElementById("login-form").addEventListener("submit", async (e) => {
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
      msg.textContent = "Login failed";
      return;
    }

    const data = await res.json();
    // assuming backend returns: { "access_token": "...", "token_type": "bearer" }
    localStorage.setItem("access_token", data.access_token);

    window.location.href = "/main.html";

    msg.textContent = "Logged in!";
  } catch (err) {
    msg.textContent = "Error logging in";
  }
});

// Example of calling a protected route using the token:
async function callProtected() {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_BASE}/shows`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(await res.json());
}

document.getElementById("signup-form").addEventListener("submit", async (e) => {
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
      return;
    }

    const data = await res.json();
    // assuming backend returns: { "access_token": "...", "token_type": "bearer" }
    localStorage.setItem("access_token", data.access_token);

    window.location.href = "/main.html";

    msg.textContent = "Signed up and logged in!";
  } catch (err) {
    msg.textContent = "Error signing up";
  }
});
