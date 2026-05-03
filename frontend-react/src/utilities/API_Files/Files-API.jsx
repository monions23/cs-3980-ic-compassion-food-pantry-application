/* ====================
  GET FILES
  ========================= */
export const getFiles = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/files", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch files");

    const files = await res.json();

    return files;
  } catch (err) {
    console.error(err);
    alert("Error loading files");
  }
};

/* ====================
  UPLOAD A FILE
 ========================= */
export const uploadFile = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const res = await fetch("http://127.0.0.1:8000/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    alert("File uploaded successfully!");

    e.target.reset();
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
};

/* ====================
  DELETE A FILE
 ========================= */
export const deleteFile = async (fileId) => {
  if (!confirm("Are you sure you want to delete this file?")) return;

  try {
    const res = await fetch(`http://127.0.0.1:8000/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!res.ok) throw new Error("Delete failed");

    alert("File deleted");
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};
