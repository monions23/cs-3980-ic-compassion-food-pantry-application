/* =========================
     FUNCTION TO DECODE TOKEN 
     FOR DETERMINING IF USER IS ADMIN
  ========================= */
export function decodeTokenSafe() {
  const token = localStorage.getItem("access_token");

  if (!token || token.split(".").length !== 3) {
    return null;
  }

  try {
    let base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");

    while (base64.length % 4 !== 0) base64 += "=";

    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}
