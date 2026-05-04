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

  return res;
};

/* ====================
  CHANGE EMAIL
  ========================= */
export const changeEmail = async (newEmail, password) => {
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

  return res;
};
