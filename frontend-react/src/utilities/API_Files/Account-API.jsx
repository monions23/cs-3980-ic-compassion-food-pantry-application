/* ====================
RESET PASSWORD
========================= */
export const resetPassword = async (currentPass, newPass) => {
  const token = localStorage.getItem("access_token");

  const res = await fetch("http://127.0.0.1:8000/auth/change-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      current_password: currentPass,
      new_password: newPass,
    }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    const text = await res.text();
    console.error("Backend error:", text);
    alert(text);
    return;
  }

  if (!res.ok) {
    alert(data.detail || "Password update failed");
    return;
  }

  alert("Password successfully updated!");
};

/* ====================
  CHANGE EMAIL
  ========================= */
export const changeEmail = async (newEmail, password, setHandler) => {
  event.preventDefault();

  const token = localStorage.getItem("access_token");

  const res = await fetch("http://127.0.0.1:8000/users/change-email", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      new_email: newEmail,
      password: password,
    }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    const text = await res.text();
    alert(text);
    return;
  }

  if (!res.ok) {
    alert(data.detail || "Failed to update email");
    return;
  }

  // IMPORTANT: replace token
  localStorage.setItem("access_token", data.access_token);
  setHandler(newEmail);

  alert("Email updated successfully");
};
