export const LOGGED_OUT_SIDEBAR_LINKS = [
  { path: "/welcome", label: "Home" },
  { path: "/login-signup", label: "Sign In" },
];

export const AUTHENTICATED_SIDEBAR_LINKS = [
  { path: "/", label: "Home", roles: ["BasicUser", "Admin"] },
  { path: "/pantry", label: "Pantry", roles: ["BasicUser", "Admin"] },
  { path: "/stock", label: "Stock", roles: ["BasicUser", "Admin"] },
  { path: "/trends", label: "Trends", roles: ["Admin"] },
  { path: "/archive", label: "Archive", roles: ["Admin"] },
  { path: "/account", label: "Account", roles: ["BasicUser", "Admin"] },
  { path: "/documents", label: "Documents", roles: ["Admin"] },
];
