export const LOGGED_OUT_SIDEBAR_LINKS = [
  { path: "/welcome", label: "Home" },
  { path: "/login-signup", label: "Sign In" },
];

export const AUTHENTICATED_SIDEBAR_LINKS = [
  { path: "/", label: "Home", roles: ["BasicUser"] },
  { path: "/home-admin", label: "Home", roles: ["SuperAdmin"] },
  { path: "/pantry", label: "Pantry", roles: ["SuperAdmin"] },
  { path: "/stock", label: "Stock", roles: ["SuperAdmin"] },
  { path: "/trends", label: "Trends", roles: ["SuperAdmin"] },
  { path: "/archive", label: "Archive", roles: ["SuperAdmin"] },
  { path: "/account", label: "Account", roles: ["BasicUser", "SuperAdmin"] },
  {
    path: "/documents",
    label: "Documents",
    roles: ["BasicUser", "SuperAdmin"],
  },
];
