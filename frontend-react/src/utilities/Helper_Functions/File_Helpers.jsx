import { decodeTokenSafe } from "./Auth_Helpers";
/* =========================
     FUNCTION TO HIDE UPLOAD 
     FEATURE IF USER IS NOT AN ADMIN
  ========================= */
export function hideUploadIfNotAdmin() {
  const payload = decodeTokenSafe();

  if (!payload) return;

  if (payload.role !== "Admin") {
    return false;
  }

  return true;
}
