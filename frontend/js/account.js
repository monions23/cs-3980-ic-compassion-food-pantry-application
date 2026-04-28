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

    const data = await res.json();

    if (!res.ok) {
        alert(data.detail || "Failed to update email");
        return;
    }

    alert("Email updated successfully");

    // optional: refresh UI
    document.getElementById("user-email").innerText = newEmail;
}

document.addEventListener("DOMContentLoaded", () => {

    const resetLink = document.getElementById("resetPasswordLink");
    if (resetLink) {
        resetLink.addEventListener("click", (event) => {
            event.preventDefault();

            const section = document.getElementById("resetPasswordSection");
            if (section) {
                section.style.display = "block";
            } else {
                console.error("resetPasswordSection NOT FOUND");
            }
        });
    }

    const btn = document.getElementById("changeEmailBtn");
    if (btn) {
        btn.addEventListener("click", () => {
            const section = document.getElementById("changeEmailSection");
            if (section) {
                section.style.display = "block";
            } else {
                console.error("changeEmailSection NOT FOUND");
            }
        });
    }

});