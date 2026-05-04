import Layout from "./Layout";
import { useEffect, useState } from "react";
import {
  getFiles,
  uploadFile,
  deleteFile,
} from "../utilities/API_Files/Files-API";

export default function Documents() {
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);

  /* ====================
  LOAD USER (for permissions)
  ========================= */
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("http://127.0.0.1:8000/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    }

    loadUser();
  }, []);

  /* ====================
  LOAD FILES
  ========================= */
  async function handleFileLoad() {
    const filesLoaded = await getFiles();
    setFiles(filesLoaded || []); 
  }

  /* ====================
  UPLOAD FILE
  ========================= */
  async function handleFileUpload(e) {
    e.preventDefault(); 

    await uploadFile(e);
    handleFileLoad();
  }

  /* ====================
  DELETE FILE
  ========================= */
  async function handleFileDelete(fileId) {
    await deleteFile(fileId);
    handleFileLoad();
  }

  /* ====================
  LOAD FILES ON PAGE LOAD
  ========================= */
  useEffect(() => {
    handleFileLoad();
  }, []);

  return (
    <Layout>
      <div className="main-grid">
        
        {/* LEFT SIDE */}
        <div className="main-structure-top">
          <h1>Upload and Download files</h1>

          {/* Only show upload for SuperAdmin */}
          {user?.role === "SuperAdmin" && (
            <form id="uploadForm" onSubmit={handleFileUpload}>
              <input type="file" name="file" required />
              <button type="submit">Upload</button>
            </form>
          )}
        </div>

        {/* BOTTOM */}
        <div className="main-structure-bottom">
          <h2>File Viewer</h2>
          <p>Select a file to download or open it.</p>

          <table id="fileTable" className="table table-striped">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Uploaded By</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td colSpan="3">No files found</td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file._id}> 
                    <td>{file.filename}</td>
                    <td>{file.uploaded_by}</td>
                    <td>
                      <a
                        href={`http://127.0.0.1:8000/files/download/${file._id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>

                      {/*only allow delete for admins */}
                      {user?.role === "SuperAdmin" && (
                        <button
                          onClick={() => handleFileDelete(file._id)}
                          style={{ marginLeft: "10px" }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}