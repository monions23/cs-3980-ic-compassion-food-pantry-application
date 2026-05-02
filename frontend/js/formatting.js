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
// function getUserFromToken() {
//   const token = localStorage.getItem("access_token");
//   console.log("Token:", token);

//   if (!token) return null;

//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     console.log("Payload:", payload);
//     return payload;
//   } catch (err) {
//     console.error("Invalid token:", err);
//     return null;
//   }
// }

function getUserFromToken() {
    const token = localStorage.getItem("access_token");

    console.log("Token:", token);

    if (!token) {
        console.warn("No token found in localStorage");
        return null;
    }

    try {
        const payload = token.split(".")[1];

        if (!payload) return null;

        const decoded = JSON.parse(atob(payload));
        return decoded;

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

//
// LOG OUT FUNCTION
//

function logout() {
  console.log("Logging out...");

  // Remove token
  localStorage.removeItem("access_token");

  // Redirect to logged-out homepage
  window.location.href = "main-logged-out.html";
}

// //
// // THIS IS FOR AUTHENTICATION TO KNOW WHICH TASK BAR TO SHOW
// //
// function parseJwt(token) {
//   try {
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch {
//     return null;
//   }
// }

// function getUserRole() {
//   const token = localStorage.getItem("access_token");

//   if (!token) return "guest";

//   const user = parseJwt(token);
//   if (!user || !user.role) return "guest";

//   const role = user.role;

//   // normalize roles
//   if (role.includes("SuperAdmin")) return "admin";
//   if (role.includes("BasicUser")) return "user";

//   return "guest";
// }
// function applyRoleVisibility() {
//   const role = getUserRole();

//   const elements = document.querySelectorAll(".sidebar-links");

//   elements.forEach((el) => {
//     const allowed = el.getAttribute("data-role");

//     if (
//       allowed === "all" ||
//       allowed === role ||
//       (role === "admin" && allowed === "user") // admin inherits user access
//     ) {
//       el.style.display = "block";
//     } else {
//       el.style.display = "none";
//     }
//   });
// }

// function goToHomepage() {
//   const token = localStorage.getItem("access_token");

//   // Not logged in
//   if (!token) {
//     window.location.href = "main-logged-out.html";
//     return;
//   }

//   const user = parseJwt(token);

//   if (!user) {
//     window.location.href = "main-logged-out.html";
//     return;
//   }

//   // Role-based redirect
//   if (user.role === "SuperAdmin") {
//     window.location.href = "main-admin.html";
//   } else {
//     window.location.href = "main-BasicUser.html";
//   }
// }

// //
// // Run it
// //
// document.addEventListener("DOMContentLoaded", () => {
//   applyRoleVisibility();
// });
