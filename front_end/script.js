
// ========================================
// E-Vaccine Reminder Frontend
// ========================================

const API_URL = "http://localhost:5000";

// ========================================
// Login
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const loginMessage = document.getElementById("loginMessage");

        try {
            const response = await fetch(API_URL + "/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                loginMessage.textContent = "Login successful!";
                loginMessage.style.color = "green";

                setTimeout(function () {
                    window.location.href =
                        data.user.role === "admin" ? "admin.html" : "dashboard.html";
                }, 1000);
            } else {
                loginMessage.textContent = data.message || "Login failed.";
                loginMessage.style.color = "red";
            }
        } catch (error) {
            console.log(error);
            loginMessage.textContent = "Unable to connect to server.";
            loginMessage.style.color = "red";
        }
    });
}

// ========================================
// Registration
// ========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const registerMessage = document.getElementById("registerMessage");

        if (password !== confirmPassword) {
            registerMessage.textContent = "Passwords do not match.";
            registerMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch(API_URL + "/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                registerMessage.textContent = "Registration successful!";
                registerMessage.style.color = "green";
                registerForm.reset();

                setTimeout(function () {
                    window.location.href = "login.html";
                }, 1500);
            } else {
                registerMessage.textContent = data.message || "Registration failed.";
                registerMessage.style.color = "red";
            }
        } catch (error) {
            console.log(error);
            registerMessage.textContent = "Unable to connect to server.";
            registerMessage.style.color = "red";
        }
    });
}

// ========================================
// Get Token
// ========================================

function getToken() {
    return localStorage.getItem("token");
}

// ========================================
// Get User
// ========================================

function getUser() {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}

// ========================================
// Dashboard Protection
// ========================================

const dashboardContainer = document.querySelector(".dashboard-container");

if (dashboardContainer) {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
        window.location.href = "login.html";
    }
}

// ========================================
// Welcome Message
// ========================================

const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage) {
    const user = getUser();

    if (user) {
        welcomeMessage.textContent = "Welcome, " + user.name + "!";
    }
}

// ========================================
// Add Child
// ========================================

const childForm = document.getElementById("childForm");

if (childForm) {
    childForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("childName").value;
        const dateOfBirth = document.getElementById("dateOfBirth").value;
        const gender = document.getElementById("gender").value;
        const childMessage = document.getElementById("childMessage");

        const user = getUser();
        const token = getToken();

        if (!user || !token) {
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch(API_URL + "/api/children/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    name,
                    dateOfBirth,
                    gender,
                    parentId: user.id
                })
            });

            const data = await response.json();

            if (response.ok) {
                childMessage.textContent = "Child added successfully!";
                childMessage.style.color = "green";
                childForm.reset();
                await loadChildren();
            } else {
                childMessage.textContent = data.message || "Failed to add child.";
                childMessage.style.color = "red";
            }
        } catch (error) {
            console.log(error);
            childMessage.textContent = "Unable to connect to server.";
            childMessage.style.color = "red";
        }
    });
}

// ========================================
// Load Children
// ========================================

async function loadChildren() {
    const childrenList = document.getElementById("childrenList");

    if (!childrenList) {
        console.log("Children list element not found!");
        return;
    }

    childrenList.textContent = "Loading children...";

    try {
        const token = getToken();

        if (!token) {
            childrenList.textContent = "Please login again.";
            console.log("Login token not found!");
            return;
        }

        console.log("Fetching children from backend...");

        const response = await fetch(API_URL + "/api/children/view", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            }
        });

        console.log("Children API status:", response.status);

        const data = await response.json();

        console.log("Children API response:", data);

        if (!response.ok) {
            childrenList.textContent = data.message || "Failed to load children.";
            return;
        }

        if (!data.children || data.children.length === 0) {
            childrenList.textContent = "No children found. Please add a child.";
            updateChildDropdown([]);
            return;
        }

        childrenList.innerHTML = "";

        data.children.forEach(function (child) {
            const childCard = document.createElement("div");
            childCard.className = "child-card";

            const name = document.createElement("h3");
            name.textContent = child.name;

            const dob = document.createElement("p");
            dob.textContent = "Date of Birth: " + formatDate(child.dateOfBirth);

            const gender = document.createElement("p");
            gender.textContent = "Gender: " + child.gender;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", function () {
                updateChild(child);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
                deleteChild(child._id);
            });

            childCard.appendChild(name);
            childCard.appendChild(dob);
            childCard.appendChild(gender);
            childCard.appendChild(editButton);
            childCard.appendChild(deleteButton);

            childrenList.appendChild(childCard);
        });

        updateChildDropdown(data.children);

        console.log("Children displayed successfully!");
    } catch (error) {
        console.error("Error loading children:", error);
        childrenList.textContent = "Unable to load children. Please try again.";
    }
}

// ========================================
// EDIT CHILD - NEW FUNCTION
// ========================================

async function updateChild(child) {
    try {
        const token = getToken();

        if (!token) {
            alert("Please login again.");
            window.location.href = "login.html";
            return;
        }

        const name = prompt("Enter child name:", child.name);
        if (name === null) return;

        const dateOfBirth = prompt(
            "Enter date of birth (YYYY-MM-DD):",
            child.dateOfBirth.substring(0, 10)
        );
        if (dateOfBirth === null) return;

        const gender = prompt(
            "Enter gender (Male/Female/Other):",
            child.gender
        );
        if (gender === null) return;

        if (!name.trim() || !dateOfBirth.trim() || !gender.trim()) {
            alert("Please enter all child details.");
            return;
        }

        const response = await fetch(
            API_URL + "/api/children/update/" + child._id,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    name: name.trim(),
                    dateOfBirth: dateOfBirth.trim(),
                    gender: gender.trim()
                })
            }
        );

        const data = await response.json();
        console.log("Update child response:", data);

        if (!response.ok) {
            alert(data.message || "Failed to update child.");
            return;
        }

        alert("Child updated successfully!");
        await loadChildren();

    } catch (error) {
        console.error("Update child error:", error);
        alert("Unable to update child. Check Console.");
    }
}

// ========================================
// DELETE CHILD - NEW FUNCTION
// ========================================

async function deleteChild(childId) {
    try {
        const token = getToken();

        if (!token) {
            alert("Please login again.");
            window.location.href = "login.html";
            return;
        }

        const confirmDelete = confirm(
            "Are you sure you want to delete this child?"
        );

        if (!confirmDelete) return;

        const response = await fetch(
            API_URL + "/api/children/delete/" + childId,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();
        console.log("Delete child response:", data);

        if (!response.ok) {
            alert(data.message || "Failed to delete child.");
            return;
        }

        alert("Child deleted successfully!");

        await loadChildren();
        await loadReminders();

    } catch (error) {
        console.error("Delete child error:", error);
        alert("Unable to delete child. Check Console.");
    }
}

// ========================================
// Update Child Dropdown
// ========================================

function updateChildDropdown(children) {
    const dropdown = document.getElementById("reminderChild");

    if (!dropdown) {
        return;
    }

    dropdown.innerHTML = '<option value="">Select Child</option>';

    children.forEach(function (child) {
        const option = document.createElement("option");
        option.value = child._id;
        option.textContent = child.name;
        dropdown.appendChild(option);
    });
}

// ========================================
// Load Vaccines
// ========================================

async function loadVaccines() {
    const vaccinesList = document.getElementById("vaccinesList");

    if (!vaccinesList) {
        return;
    }

    const token = getToken();

    if (!token) {
        return;
    }

    try {
        const response = await fetch(API_URL + "/api/vaccines/view", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            vaccinesList.innerHTML = "<p>Unable to load vaccines.</p>";
            return;
        }

        if (!data.vaccines || data.vaccines.length === 0) {
            vaccinesList.innerHTML = "<p>No vaccines available.</p>";
            updateVaccineDropdown([]);
            return;
        }

        vaccinesList.innerHTML = "";

        data.vaccines.forEach(function (vaccine) {
            const item = document.createElement("div");
            item.className = "data-item";

            const heading = document.createElement("h3");
            heading.textContent = vaccine.vaccineName;

            const description = document.createElement("p");
            description.textContent = "Description: " + (vaccine.description || "N/A");

            const age = document.createElement("p");
            age.textContent = "Recommended Age: " + (vaccine.recommendedAge || "N/A");

            const dose = document.createElement("p");
            dose.textContent = "Dose Number: " + (vaccine.doseNumber || "N/A");

            item.appendChild(heading);
            item.appendChild(description);
            item.appendChild(age);
            item.appendChild(dose);

            vaccinesList.appendChild(item);
        });

        updateVaccineDropdown(data.vaccines);

    } catch (error) {
        console.log(error);
        vaccinesList.innerHTML = "<p>Unable to connect to server.</p>";
    }
}

// ========================================
// Update Vaccine Dropdown
// ========================================

function updateVaccineDropdown(vaccines) {
    const dropdown = document.getElementById("reminderVaccine");

    if (!dropdown) {
        return;
    }

    dropdown.innerHTML = '<option value="">Select Vaccine</option>';

    vaccines.forEach(function (vaccine) {
        const option = document.createElement("option");
        option.value = vaccine._id;
        option.textContent = vaccine.vaccineName;
        dropdown.appendChild(option);
    });
}

// ========================================
// Add Reminder
// ========================================

const reminderForm = document.getElementById("reminderForm");

if (reminderForm) {
    reminderForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const childId = document.getElementById("reminderChild").value;
        const vaccineId = document.getElementById("reminderVaccine").value;
        const dueDate = document.getElementById("dueDate").value;
        const reminderMessage = document.getElementById("reminderMessage");
        const token = getToken();

        if (!token) {
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch(API_URL + "/api/reminders/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ childId, vaccineId, dueDate })
            });

            const data = await response.json();

            if (response.ok) {
                reminderMessage.textContent = "Reminder added successfully!";
                reminderMessage.style.color = "green";
                reminderForm.reset();
                loadReminders();
            } else {
                reminderMessage.textContent = data.message || "Failed to add reminder.";
                reminderMessage.style.color = "red";
            }
        } catch (error) {
            console.log(error);
            reminderMessage.textContent = "Unable to connect to server.";
            reminderMessage.style.color = "red";
        }
    });
}

// ========================================
// Load Reminders
// ========================================

async function loadReminders() {
    const remindersList = document.getElementById("remindersList");

    if (!remindersList) {
        return;
    }

    const token = getToken();

    if (!token) {
        return;
    }

    try {
        const response = await fetch(API_URL + "/api/reminders/view", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            remindersList.innerHTML = "<p>Unable to load reminders.</p>";
            return;
        }

        if (!data.reminders || data.reminders.length === 0) {
            remindersList.innerHTML = "<p>No reminders available.</p>";
            return;
        }

        remindersList.innerHTML = "";

        data.reminders.forEach(function (reminder) {
            const item = document.createElement("div");
            item.className = "data-item";

            const childName = reminder.childId
                ? reminder.childId.name
                : "Unknown Child";

            const vaccineName = reminder.vaccineId
                ? reminder.vaccineId.vaccineName
                : "Unknown Vaccine";

            const statusClass = reminder.status === "Completed"
                ? "status-completed"
                : "status-pending";

            let button = "";

            if (reminder.status !== "Completed") {
                button = `
                    <button
                        class="complete-btn"
                        onclick="completeReminder('${reminder._id}')">
                        Mark as Completed
                    </button>
                `;
            }

            item.innerHTML = `
                <h3>${vaccineName}</h3>
                <p><strong>Child:</strong> ${childName}</p>
                <p><strong>Due Date:</strong> ${formatDate(reminder.dueDate)}</p>
                <p class="${statusClass}">
                    <strong>Status:</strong> ${reminder.status}
                </p>
                ${button}
            `;

            remindersList.appendChild(item);
        });

    } catch (error) {
        console.log(error);
        remindersList.innerHTML = "<p>Unable to connect to server.</p>";
    }
}

// ========================================
// Complete Reminder
// ========================================

async function completeReminder(reminderId) {
    const token = getToken();

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(
            API_URL + "/api/reminders/complete/" + reminderId,
            {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (response.ok) {
            loadReminders();
        } else {
            alert(data.message || "Failed to complete reminder.");
        }
    } catch (error) {
        console.log(error);
        alert("Unable to connect to server.");
    }
}

// ========================================
// Format Date
// ========================================

function formatDate(date) {
    if (!date) {
        return "N/A";
    }

    const dateObject = new Date(date);
    return dateObject.toLocaleDateString("en-IN");
}

// ========================================
// Refresh Children
// ========================================

const refreshChildren = document.getElementById("refreshChildren");

if (refreshChildren) {
    refreshChildren.addEventListener("click", loadChildren);
}

// ========================================
// Refresh Vaccines
// ========================================

const refreshVaccines = document.getElementById("refreshVaccines");

if (refreshVaccines) {
    refreshVaccines.addEventListener("click", loadVaccines);
}

// ========================================
// Refresh Reminders
// ========================================

const refreshReminders = document.getElementById("refreshReminders");

if (refreshReminders) {
    refreshReminders.addEventListener("click", loadReminders);
}

// ========================================
// Logout
// ========================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
        event.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    });
}

// ========================================
// Load Dashboard Data
// ========================================

if (dashboardContainer) {
    loadChildren();
    loadVaccines();
    loadReminders();
}

// ========================================
// Admin Dashboard
// ========================================

const addVaccineForm = document.getElementById("addVaccineForm");

// ========================================
// Check Admin Login
// ========================================

if (addVaccineForm) {
    const token = getToken();
    const user = getUser();

    if (!token || !user || user.role !== "admin") {
        window.location.href = "login.html";
    }
}

// ========================================
// Admin Welcome Message
// ========================================

const adminWelcome = document.getElementById("adminWelcome");

if (adminWelcome) {
    const user = getUser();

    if (user) {
        adminWelcome.textContent = "Welcome, " + user.name + "!";
    }
}

// ========================================
// Add Vaccine
// ========================================

if (addVaccineForm) {
    addVaccineForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const vaccineName = document.getElementById("vaccineName").value;
        const description = document.getElementById("vaccineDescription").value;
        const recommendedAge = document.getElementById("recommendedAge").value;
        const doseNumber = document.getElementById("doseNumber").value;
        const adminMessage = document.getElementById("adminMessage");
        const token = getToken();

        try {
            const response = await fetch(API_URL + "/api/vaccines/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    vaccineName,
                    description,
                    recommendedAge,
                    doseNumber: Number(doseNumber)
                })
            });

            const data = await response.json();

            if (response.ok) {
                adminMessage.textContent = "Vaccine added successfully!";
                adminMessage.style.color = "green";
                addVaccineForm.reset();
                loadAdminVaccines();
            } else {
                adminMessage.textContent = data.message || "Failed to add vaccine.";
                adminMessage.style.color = "red";
            }
        } catch (error) {
            console.log(error);
            adminMessage.textContent = "Unable to connect to server.";
            adminMessage.style.color = "red";
        }
    });
}

// ========================================
// Load Vaccines for Admin
// ========================================

async function loadAdminVaccines() {
    const vaccinesList = document.getElementById("adminVaccinesList");

    if (!vaccinesList) {
        return;
    }

    const token = getToken();

    if (!token) {
        return;
    }

    try {
        const response = await fetch(API_URL + "/api/vaccines/view", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            vaccinesList.innerHTML = "<p>Unable to load vaccines.</p>";
            return;
        }

        if (!data.vaccines || data.vaccines.length === 0) {
            vaccinesList.innerHTML = "<p>No vaccines available.</p>";
            return;
        }

        vaccinesList.innerHTML = "";

        data.vaccines.forEach(function (vaccine) {
            const item = document.createElement("div");
            item.className = "data-item";

            item.innerHTML = `
                <h3>${vaccine.vaccineName}</h3>
                <p><strong>Description:</strong> ${vaccine.description || "N/A"}</p>
                <p><strong>Recommended Age:</strong> ${vaccine.recommendedAge || "N/A"}</p>
                <p><strong>Dose Number:</strong> ${vaccine.doseNumber || "N/A"}</p>
                <br>
                <button class="small-btn" onclick="updateVaccine('${vaccine._id}')">
                    Edit
                </button>
                <button class="complete-btn" onclick="deleteVaccine('${vaccine._id}')">
                    Delete
                </button>
            `;

            vaccinesList.appendChild(item);
        });

    } catch (error) {
        console.log(error);
        vaccinesList.innerHTML = "<p>Unable to connect to server.</p>";
    }
}

// ========================================
// Delete Vaccine
// ========================================

async function deleteVaccine(vaccineId) {
    const token = getToken();

    const confirmDelete = confirm(
        "Are you sure you want to delete this vaccine?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            API_URL + "/api/admin/vaccine/delete/" + vaccineId,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Vaccine deleted successfully!");
            loadAdminVaccines();
        } else {
            alert(data.message || "Failed to delete vaccine.");
        }
    } catch (error) {
        console.log(error);
        alert("Unable to connect to server.");
    }
}

// ========================================
// Update Vaccine
// ========================================

async function updateVaccine(vaccineId) {
    const vaccineName = prompt("Enter new vaccine name:");

    if (vaccineName === null) {
        return;
    }

    const description = prompt("Enter new description:");

    if (description === null) {
        return;
    }

    const recommendedAge = prompt("Enter recommended age:");

    if (recommendedAge === null) {
        return;
    }

    const doseNumber = prompt("Enter dose number:");

    if (doseNumber === null) {
        return;
    }

    const token = getToken();

    try {
        const response = await fetch(
            API_URL + "/api/admin/vaccine/update/" + vaccineId,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    vaccineName,
                    description,
                    recommendedAge,
                    doseNumber: Number(doseNumber)
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Vaccine updated successfully!");
            loadAdminVaccines();
        } else {
            alert(data.message || "Failed to update vaccine.");
        }
    } catch (error) {
        console.log(error);
        alert("Unable to connect to server.");
    }
}

// ========================================
// Refresh Admin Vaccines
// ========================================

const refreshAdminVaccines = document.getElementById("refreshAdminVaccines");

if (refreshAdminVaccines) {
    refreshAdminVaccines.addEventListener("click", loadAdminVaccines);
}

// ========================================
// Admin Logout
// ========================================

const adminLogout = document.getElementById("adminLogout");

if (adminLogout) {
    adminLogout.addEventListener("click", function (event) {
        event.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    });
}

// ========================================
// Load Admin Dashboard
// ========================================

if (addVaccineForm) {
    loadAdminVaccines();
}
