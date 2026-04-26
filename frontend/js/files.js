document.addEventListener("DOMContentLoaded", loadFiles);

async function loadFiles() {
    const res = await fetch("http://127.0.0.1:8000/files");
    const files = await res.json();

    const tbody = document.querySelector("#fileTable tbody");
    tbody.innerHTML = "";

    files.forEach(file => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td>${file.filename}</td>
      <td>${file.uploaded_by}</td>
      <td>
        <a href="http://127.0.0.1:8000/files/download/${file._id}" target="_blank">
          Download
        </a>
        <button onclick="deleteFile('${file._id}')">
         Delete
        </button>
      </td>
    `;

        tbody.appendChild(row);
    });
}

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    console.log("Uploaded:", data);

    // refresh table after upload
    loadFiles();
});

async function deleteFile(fileId) {
  const confirmDelete = confirm("Are you sure you want to delete this file?");
  if (!confirmDelete) return;

  const res = await fetch(`http://127.0.0.1:8000/files/${fileId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (res.ok) {
    loadFiles(); // refresh table
  } else {
    const err = await res.json();
    alert(err.detail);
  }
}