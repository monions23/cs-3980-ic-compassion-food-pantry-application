import Chart from "chart.js/auto"; // for charts
import { useEffect, useRef } from "react"; // for accessing instances of chart in HTML

export default function StockChart({ data }) {
  // Chart reference
  const chartRef = useRef(null); // reference to the chart canvas
  const chartInstance = useRef(null); // reference to the Chart.js instance

  /* =========================
         UPDATE CHART
      ========================= */
  const updateChart = (data) => {
    if (!chartRef.current) return; // if the canvas is not rendered yet, do nothing

    const labels = data.map((i) => i.item_name); // labels for the chart (item names)
    const quantities = data.map((i) => i.quantity); // current stock quantities
    const targets = data.map((i) => i.target_quantity); // target stock quantities

    // if a chart instance already exists, destroy it before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    //
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Current Stock",
            data: quantities,
            backgroundColor: "#65bac2",
          },
          { label: "Target Stock", data: targets, backgroundColor: "#bc1a38" },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  // update chart whenever the data changes
  useEffect(() => {
    updateChart(data);
  }, [data]);

  return (
    <>
      <div className="chart-container">
        <div className="graph">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </>
  );
}
