/* =========================
   SIDEBAR TOGGLE
========================= */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");
}


/*
 THIS IS FOR THE USERNAME IN CORNER
*/
function getUserFromToken() {
  const token = localStorage.getItem("token");
  console.log("Token:", token);

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Payload:", payload);
    return payload;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const emailSpan = document.getElementById("user-email");
  if (!emailSpan) return;

  const user = getUserFromToken();

  if (user && user.email) {
    emailSpan.textContent = user.email;
  } else {
    emailSpan.textContent = "Not logged in";
  }
});