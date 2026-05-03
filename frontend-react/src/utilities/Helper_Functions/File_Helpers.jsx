/* =========================
     FUNCTION TO HIDE UPLOAD 
     FEATURE IF USER IS NOT AN ADMIN
  ========================= */
export function hideUploadIfNotAdmin() {
  const payload = decodeTokenSafe();

  if (!payload) return;

  if (payload.role !== "Admin") {
    const section = document.getElementById("uploadSection");
    if (section) section.style.display = "none";
  }
}

/* =========================
     FUNCTION TO DECODE TOKEN 
     FOR DETERMINING IF USER IS ADMIN
  ========================= */
function decodeTokenSafe() {
  const token = localStorage.getItem("access_token");

  if (!token || token.split(".").length !== 3) {
    return null;
  }

  try {
    let base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");

    while (base64.length % 4 !== 0) base64 += "=";

    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
}
