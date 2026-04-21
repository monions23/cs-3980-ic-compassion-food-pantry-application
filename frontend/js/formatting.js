/* To toggle sidebar */

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  // Toggles the 'active' class: adds it if missing, removes it if present
  sidebar.classList.toggle("active");
}













/*This is for the stock linechart in the current stock
*/
const ctx = document.getElementById('Stockchart');

    const stockData = [50, 75, 60, 90, 120, 100, 80, 110];
    const weeks = ["W1","W2","W3","W4","W5","W6","W7","W8"];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: weeks,
        datasets: [{
          label: 'Stock Units',
          data: stockData,
          borderWidth: 3,
          fill: true, // this is the area fill beneath the lines
          
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true
          },
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Weeks'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Stock Units'
            }
          }
        }
      }
    });