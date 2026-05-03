import Layout from "./Layout";
import { useEffect, useState } from "react";
import {
  getFiles,
  uploadFile,
  deleteFile,
} from "../utilities/API_Files/Files-API";

export default function Documents() {
  const [files, setFiles] = useState([]);

  /* ====================
  HANDLE LOADING THE FILES
 ========================= */
  async function handleFileLoad() {
    const filesLoaded = await getFiles();
    setFiles(filesLoaded);
  }

  /* ====================
  HANDLE UPLOADING A FILE
 ========================= */
  async function handleFileUpload(e) {
    await uploadFile(e);
    handleFileLoad();
  }

  /* ====================
  HANDLE DELETING A FILE
 ========================= */
  async function handleFileDelete(fileId) {
    await deleteFile(fileId);
    handleFileLoad();
  }

  /* ====================
  LOAD FILES UPON PAGE LOAD
 ========================= */
  useEffect(() => {
    handleFileLoad();
  }, []);

  return (
    <>
      <Layout>
        <div className="main-grid">
          <div className="main-structure-left">
            <h1>Upload and Download files</h1>
            <form id="uploadForm">
              <input type="file" name="file" />
              <button type="submit">Upload</button>
            </form>
          </div>
          <div className="main-structure-right">
            <h2>File Viewer</h2>
            <p>Select a file to download or open it.</p>
            <table id="fileTable" class="table table-striped">
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
                    <tr key={file.filename}>
                      <td>{file.filename}</td>
                      <td>{file.uploaded_by}</td>
                      <td>
                        <a
                          href={`http://127.0.0.1:8000/files/download/${file._id}`}
                          target="_blank"
                        >
                          Download
                        </a>
                        <button onClick={() => handleFileDelete(file._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
}
