import { useState } from "react";

export function useSidebarToggle() {
  const [active, setActive] = useState(false);
  const toggleSidebar = () => setActive((prev) => !prev);

  return { active, toggleSidebar };
}
