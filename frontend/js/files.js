document.addEventListener("DOMContentLoaded", () => {
    loadFiles();

    const form = document.getElementById("uploadForm");
    if (form) {
        form.addEventListener("submit", uploadFile);
    }
});

async function loadFiles() {
    try {
        const res = await fetch("http://127.0.0.1:8000/files/", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        });

        if (!res.ok) throw new Error("Failed to fetch files");

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

    } catch (err) {
        console.error(err);
        alert("Error loading files");
    }
    
}

async function uploadFile(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const res = await fetch("http://127.0.0.1:8000/files/upload", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            body: formData
        });

        if (!res.ok) throw new Error("Upload failed");

        alert("File uploaded successfully!");

        e.target.reset();
        loadFiles();

    } catch (err) {
        console.error(err);
        alert("Upload failed");
    }
}

function hideUploadIfNotAdmin() {
    const payload = decodeTokenSafe();

    if (!payload) return;

    if (payload.role !== "Admin") {
        const section = document.getElementById("uploadSection");
        if (section) section.style.display = "none";
    }
}
document.addEventListener("DOMContentLoaded", hideUploadIfNotAdmin);

async function deleteFile(fileId) {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
        const res = await fetch(`http://127.0.0.1:8000/files/${fileId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        });

        if (!res.ok) throw new Error("Delete failed");

        alert("File deleted");
        loadFiles();

    } catch (err) {
        console.error(err);
        alert("Delete failed");
    }
}

function decodeTokenSafe() {
    const token = localStorage.getItem("access_token");

    if (!token || token.split(".").length !== 3) {
        return null;
    }

    try {
        let base64 = token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        while (base64.length % 4 !== 0) base64 += "=";

        return JSON.parse(atob(base64));
    } catch (e) {
        return null;
    }
}