import Layout from "./Layout";

export default function Documents() {
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
              <tbody></tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
}
