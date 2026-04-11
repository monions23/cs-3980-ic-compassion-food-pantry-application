/* To toggle sidebar */

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  // Toggles the 'active' class: adds it if missing, removes it if present
  sidebar.classList.toggle("active");
}
