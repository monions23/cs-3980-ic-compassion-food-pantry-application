function logout() {
  localStorage.removeItem("access_token");
  window.location.href = "/signin-login.html";
}
