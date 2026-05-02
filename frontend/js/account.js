async function resetPassword(event) {
    event.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const currentPassword = document.getElementById("currentPassword")?.value;

    const token = localStorage.getItem("access_token");

    const res = await fetch("http://127.0.0.1:8000/auth/change-password", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword
        })
    });

    let data;
    try {
        data = await res.json();
    } catch (e) {
        const text = await res.text();
        console.error("Backend error:", text);
        alert(text);
        return;
    }

    if (!res.ok) {
        alert(data.detail || "Password update failed");
        return;
    }

    alert("Password successfully updated!");
}

function goToForgotPassword() {
    window.location.href = "/forgot-password.html";
}


function openChangeEmailSection() {
    const section = document.getElementById("changeEmailSection");

    if (section) {
        section.style.display = "block";
    }
}

async function submitChangeEmail(event) {
    event.preventDefault();

    const newEmail = document.getElementById("newEmail").value;
    const password = document.getElementById("confirmPassword").value;

    const token = localStorage.getItem("access_token");

    const res = await fetch("http://127.0.0.1:8000/users/change-email", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            new_email: newEmail,
            password: password
        })
    });

    let data;
    try {
        data = await res.json();
    } catch {
        const text = await res.text();
        alert(text);
        return;
    }

    if (!res.ok) {
        alert(data.detail || "Failed to update email");
        return;
    }

    // IMPORTANT: replace token
    localStorage.setItem("access_token", data.access_token);

    // update UI
    document.getElementById("user-email").innerText = newEmail;

    alert("Email updated successfully");
}

document.addEventListener("DOMContentLoaded", async () => {

    const user = await loadAccountInfo();  

    // existing code stays the same
    const resetLink = document.getElementById("resetPasswordLink");
    if (resetLink) {
        resetLink.addEventListener("click", (event) => {
            event.preventDefault();

            const section = document.getElementById("resetPasswordSection");
            if (section) {
                section.style.display = "block";
            }
        });
    }

    const btn = document.getElementById("changeEmailBtn");
    if (btn) {
        btn.addEventListener("click", () => {
            const section = document.getElementById("changeEmailSection");
            if (section) {
                section.style.display = "block";
            }
        });
    }

    // load admin table AFTER user loads
    if (user && user.role === "SuperAdmin") {
        loadAdminTable();
    }
});


// FILLING IN INFORMATION:
async function loadAccountInfo() {
    const token = localStorage.getItem("access_token");

    const res = await fetch("http://127.0.0.1:8000/users/me", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        console.error("Failed to fetch user");
        return;
    }

    const user = await res.json();

    // top right email
    document.getElementById("user-email").innerText = user.email;

    // table email + role
    document.getElementById("account-email").innerText = user.email;
    document.getElementById("account-role").innerText = user.role;

    return user;
}

//ADMIN TABLE
async function loadAdminTable() {
    const token = localStorage.getItem("access_token");

    const res = await fetch("http://127.0.0.1:8000/users/", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        console.error("Not authorized or failed");
        return;
    }

    const users = await res.json();

    const table = document.getElementById("adminTable");
    const tbody = table.querySelector("tbody");

    table.style.display = "table";
    tbody.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.email}</td>
            <td>
                <select data-id="${user.id}">
                    <option value="BasicUser" ${user.role === "BasicUser" ? "selected" : ""}>Basic User</option>
                    <option value="SuperAdmin" ${user.role === "SuperAdmin" ? "selected" : ""}>Super Admin</option>
                </select>
            </td>
            <td>
                <button onclick="updateRole('${user.id}')">Save</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

//UPDATE ROLE FUNCTION

async function updateRole(userId) {
    const token = localStorage.getItem("access_token");

    const select = document.querySelector(`select[data-id="${userId}"]`);
    const newRole = select.value;

    const res = await fetch(`http://127.0.0.1:8000/users/${userId}/role`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
    });

    if (!res.ok) {
        alert("Failed to update role");
        return;
    }

    alert("Role updated!");
}