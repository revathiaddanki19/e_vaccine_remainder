// ========================================
// E-Vaccine Reminder Frontend
// ========================================


// ========================================
// Backend URL
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

            const response = await fetch(
                API_URL + "/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                loginMessage.textContent =
                    "Login successful!";

                loginMessage.style.color = "green";

                setTimeout(function () {

                    if (data.user.role === "admin") {

                        window.location.href =
                            "admin.html";

                    } else {

                        window.location.href =
                            "dashboard.html";

                    }

                }, 1000);

            } else {

                loginMessage.textContent =
                    data.message || "Login failed.";

                loginMessage.style.color = "red";

            }

        } catch (error) {

            console.log(error);

            loginMessage.textContent =
                "Unable to connect to server.";

            loginMessage.style.color = "red";

        }

    });

}


// ========================================
// Registration
// ========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name").value;

            const email =
                document.getElementById("registerEmail").value;

            const password =
                document.getElementById("registerPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const registerMessage =
                document.getElementById("registerMessage");


            if (password !== confirmPassword) {

                registerMessage.textContent =
                    "Passwords do not match.";

                registerMessage.style.color = "red";

                return;
            }


            try {

                const response = await fetch(
                    API_URL + "/api/users/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            email: email,

                            password: password

                        })
                    }
                );


                const data = await response.json();


                if (response.ok) {

                    registerMessage.textContent =
                        "Registration successful!";

                    registerMessage.style.color = "green";

                    registerForm.reset();


                    setTimeout(function () {

                        window.location.href =
                            "login.html";

                    }, 1500);


                } else {

                    registerMessage.textContent =
                        data.message ||
                        "Registration failed.";

                    registerMessage.style.color = "red";

                }


            } catch (error) {

                console.log(error);

                registerMessage.textContent =
                    "Unable to connect to server.";

                registerMessage.style.color = "red";

            }

        }
    );

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

const dashboardContainer =
    document.querySelector(".dashboard-container");

if (dashboardContainer) {

    const token = getToken();

    const user = getUser();


    if (!token || !user) {

        window.location.href =
            "login.html";

    }

}


// ========================================
// Welcome Message
// ========================================

const welcomeMessage =
    document.getElementById("welcomeMessage");

if (welcomeMessage) {

    const user = getUser();

    if (user) {

        welcomeMessage.textContent =
            "Welcome, " + user.name + "!";

    }

}


// ========================================
// Add Child
// ========================================

const childForm =
    document.getElementById("childForm");

if (childForm) {

    childForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document.getElementById("childName").value;

            const dateOfBirth =
                document.getElementById("dateOfBirth").value;

            const gender =
                document.getElementById("gender").value;

            const childMessage =
                document.getElementById("childMessage");

            const user = getUser();

            const token = getToken();


            if (!user || !token) {

                window.location.href =
                    "login.html";

                return;

            }


            try {

                const response = await fetch(
                    API_URL + "/api/children/add",
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token

                        },

                        body: JSON.stringify({

                            name: name,

                            dateOfBirth:
                                dateOfBirth,

                            gender: gender,

                            parentId: user.id

                        })
                    }
                );


                const data = await response.json();


                if (response.ok) {

                    childMessage.textContent =
                        "Child added successfully!";

                    childMessage.style.color =
                        "green";


                    childForm.reset();


                    loadChildren();


                } else {

                    childMessage.textContent =
                        data.message ||
                        "Failed to add child.";

                    childMessage.style.color =
                        "red";

                }


            } catch (error) {

                console.log(error);

                childMessage.textContent =
                    "Unable to connect to server.";

                childMessage.style.color =
                    "red";

            }

        }
    );

}


// ========================================
// Load Children
// ========================================

async function loadChildren() {

    const childrenList =
        document.getElementById("childrenList");


    if (!childrenList) {
        return;
    }


    const user = getUser();

    const token = getToken();


    if (!user || !token) {
        return;
    }


    try {

       const response = await fetch(

    API_URL +
    "/api/children/view",

    {
        method: "GET",

        headers: {
            "Authorization":
                "Bearer " + token
        }
    }
);


        const data = await response.json();


        if (!response.ok) {

            childrenList.innerHTML =
                "<p>Unable to load children.</p>";

            return;

        }


        if (
            !data.children ||
            data.children.length === 0
        ) {

            childrenList.innerHTML =
                "<p>No children added yet.</p>";

            updateChildDropdown([]);

            return;

        }


        childrenList.innerHTML = "";


        data.children.forEach(function (child) {

            const item =
                document.createElement("div");

            item.className =
                "data-item";


            item.innerHTML = `

                <h3>${child.name}</h3>

                <p>
                    <strong>Date of Birth:</strong>
                    ${formatDate(child.dateOfBirth)}
                </p>

                <p>
                    <strong>Gender:</strong>
                    ${child.gender}
                </p>

            `;


            childrenList.appendChild(item);

        });


        updateChildDropdown(
            data.children
        );


    } catch (error) {

        console.log(error);

        childrenList.innerHTML =
            "<p>Unable to connect to server.</p>";

    }

}


// ========================================
// Update Child Dropdown
// ========================================

function updateChildDropdown(children) {

    const dropdown =
        document.getElementById("reminderChild");


    if (!dropdown) {
        return;
    }


    dropdown.innerHTML = `

        <option value="">
            Select Child
        </option>

    `;


    children.forEach(function (child) {

        const option =
            document.createElement("option");

        option.value =
            child._id;

        option.textContent =
            child.name;

        dropdown.appendChild(option);

    });

}


// ========================================
// Load Vaccines
// ========================================

async function loadVaccines() {

    const vaccinesList =
        document.getElementById("vaccinesList");


    if (!vaccinesList) {
        return;
    }


    const token = getToken();


    if (!token) {
        return;
    }


    try {

        const response = await fetch(

            API_URL +
            "/api/vaccines/view",

            {

                method: "GET",

                headers: {

                    "Authorization":
                        "Bearer " + token

                }

            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            vaccinesList.innerHTML =
                "<p>Unable to load vaccines.</p>";

            return;

        }


        if (
            !data.vaccines ||
            data.vaccines.length === 0
        ) {

            vaccinesList.innerHTML =
                "<p>No vaccines available.</p>";

            updateVaccineDropdown([]);

            return;

        }


        vaccinesList.innerHTML = "";


        data.vaccines.forEach(function (vaccine) {

            const item =
                document.createElement("div");

            item.className =
                "data-item";


            item.innerHTML = `

                <h3>
                    ${vaccine.vaccineName}
                </h3>

                <p>
                    <strong>Description:</strong>
                    ${vaccine.description || "N/A"}
                </p>

                <p>
                    <strong>Recommended Age:</strong>
                    ${vaccine.recommendedAge || "N/A"}
                </p>

                <p>
                    <strong>Dose Number:</strong>
                    ${vaccine.doseNumber || "N/A"}
                </p>

            `;


            vaccinesList.appendChild(item);

        });


        updateVaccineDropdown(
            data.vaccines
        );


    } catch (error) {

        console.log(error);

        vaccinesList.innerHTML =
            "<p>Unable to connect to server.</p>";

    }

}


// ========================================
// Update Vaccine Dropdown
// ========================================

function updateVaccineDropdown(vaccines) {

    const dropdown =
        document.getElementById(
            "reminderVaccine"
        );


    if (!dropdown) {
        return;
    }


    dropdown.innerHTML = `

        <option value="">
            Select Vaccine
        </option>

    `;


    vaccines.forEach(function (vaccine) {

        const option =
            document.createElement("option");


        option.value =
            vaccine._id;


        option.textContent =
            vaccine.vaccineName;


        dropdown.appendChild(option);

    });

}


// ========================================
// Add Reminder
// ========================================

const reminderForm =
    document.getElementById("reminderForm");


if (reminderForm) {

    reminderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const childId =
                document.getElementById(
                    "reminderChild"
                ).value;


            const vaccineId =
                document.getElementById(
                    "reminderVaccine"
                ).value;


            const dueDate =
                document.getElementById(
                    "dueDate"
                ).value;


            const reminderMessage =
                document.getElementById(
                    "reminderMessage"
                );


            const token = getToken();


            if (!token) {

                window.location.href =
                    "login.html";

                return;

            }


            try {

                const response = await fetch(

                    API_URL +
                    "/api/reminders/add",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token

                        },

                        body: JSON.stringify({

                            childId: childId,

                            vaccineId: vaccineId,

                            dueDate: dueDate

                        })

                    }

                );


                const data =
                    await response.json();


                if (response.ok) {

                    reminderMessage.textContent =
                        "Reminder added successfully!";

                    reminderMessage.style.color =
                        "green";


                    reminderForm.reset();


                    loadReminders();


                } else {

                    reminderMessage.textContent =
                        data.message ||
                        "Failed to add reminder.";

                    reminderMessage.style.color =
                        "red";

                }


            } catch (error) {

                console.log(error);

                reminderMessage.textContent =
                    "Unable to connect to server.";

                reminderMessage.style.color =
                    "red";

            }

        }
    );

}


// ========================================
// Load Reminders
// ========================================

async function loadReminders() {

    const remindersList =
        document.getElementById(
            "remindersList"
        );


    if (!remindersList) {
        return;
    }


    const token = getToken();


    if (!token) {
        return;
    }


    try {

        const response = await fetch(

            API_URL +
            "/api/reminders/view",

            {

                method: "GET",

                headers: {

                    "Authorization":
                        "Bearer " + token

                }

            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            remindersList.innerHTML =
                "<p>Unable to load reminders.</p>";

            return;

        }


        if (
            !data.reminders ||
            data.reminders.length === 0
        ) {

            remindersList.innerHTML =
                "<p>No reminders available.</p>";

            return;

        }


        remindersList.innerHTML = "";


        data.reminders.forEach(function (reminder) {

            const item =
                document.createElement("div");


            item.className =
                "data-item";


            const childName =
                reminder.childId
                    ? reminder.childId.name
                    : "Unknown Child";


            const vaccineName =
                reminder.vaccineId
                    ? reminder.vaccineId.vaccineName
                    : "Unknown Vaccine";


            const statusClass =
                reminder.status === "Completed"
                    ? "status-completed"
                    : "status-pending";


            let button = "";


            if (reminder.status !== "Completed") {

                button = `

                    <button
                        class="complete-btn"
                        onclick="completeReminder('${reminder._id}')"
                    >
                        Mark as Completed
                    </button>

                `;

            }


            item.innerHTML = `

                <h3>
                    ${vaccineName}
                </h3>

                <p>
                    <strong>Child:</strong>
                    ${childName}
                </p>

                <p>
                    <strong>Due Date:</strong>
                    ${formatDate(reminder.dueDate)}
                </p>

                <p class="${statusClass}">
                    <strong>Status:</strong>
                    ${reminder.status}
                </p>

                ${button}

            `;


            remindersList.appendChild(item);

        });


    } catch (error) {

        console.log(error);

        remindersList.innerHTML =
            "<p>Unable to connect to server.</p>";

    }

}


// ========================================
// Complete Reminder
// ========================================

async function completeReminder(reminderId) {

    const token = getToken();


    if (!token) {

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response = await fetch(

            API_URL +
            "/api/reminders/complete/" +
            reminderId,

            {

                method: "PUT",

                headers: {

                    "Authorization":
                        "Bearer " + token

                }

            }

        );


        const data =
            await response.json();


        if (response.ok) {

            loadReminders();

        } else {

            alert(
                data.message ||
                "Failed to complete reminder."
            );

        }


    } catch (error) {

        console.log(error);

        alert(
            "Unable to connect to server."
        );

    }

}


// ========================================
// Format Date
// ========================================

function formatDate(date) {

    if (!date) {
        return "N/A";
    }


    const dateObject =
        new Date(date);


    return dateObject.toLocaleDateString(
        "en-IN"
    );

}


// ========================================
// Refresh Children
// ========================================

const refreshChildren =
    document.getElementById(
        "refreshChildren"
    );


if (refreshChildren) {

    refreshChildren.addEventListener(
        "click",
        loadChildren
    );

}


// ========================================
// Refresh Vaccines
// ========================================

const refreshVaccines =
    document.getElementById(
        "refreshVaccines"
    );


if (refreshVaccines) {

    refreshVaccines.addEventListener(
        "click",
        loadVaccines
    );

}


// ========================================
// Refresh Reminders
// ========================================

const refreshReminders =
    document.getElementById(
        "refreshReminders"
    );


if (refreshReminders) {

    refreshReminders.addEventListener(
        "click",
        loadReminders
    );

}


// ========================================
// Logout
// ========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            localStorage.removeItem(
                "token"
            );


            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "login.html";

        }
    );

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

const addVaccineForm =
    document.getElementById("addVaccineForm");


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

const adminWelcome =
    document.getElementById("adminWelcome");

if (adminWelcome) {

    const user = getUser();

    if (user) {

        adminWelcome.textContent =
            "Welcome, " + user.name + "!";

    }

}


// ========================================
// Add Vaccine
// ========================================

if (addVaccineForm) {

    addVaccineForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const vaccineName =
                document.getElementById(
                    "vaccineName"
                ).value;

            const description =
                document.getElementById(
                    "vaccineDescription"
                ).value;

            const recommendedAge =
                document.getElementById(
                    "recommendedAge"
                ).value;

            const doseNumber =
                document.getElementById(
                    "doseNumber"
                ).value;


            const adminMessage =
                document.getElementById(
                    "adminMessage"
                );


            const token = getToken();


            try {

                const response = await fetch(

                    API_URL +
                    "/api/vaccines/add",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token

                        },

                        body: JSON.stringify({

                            vaccineName:
                                vaccineName,

                            description:
                                description,

                            recommendedAge:
                                recommendedAge,

                            doseNumber:
                                Number(doseNumber)

                        })

                    }

                );


                const data =
                    await response.json();


                if (response.ok) {

                    adminMessage.textContent =
                        "Vaccine added successfully!";

                    adminMessage.style.color =
                        "green";


                    addVaccineForm.reset();


                    loadAdminVaccines();


                } else {

                    adminMessage.textContent =
                        data.message ||
                        "Failed to add vaccine.";

                    adminMessage.style.color =
                        "red";

                }


            } catch (error) {

                console.log(error);

                adminMessage.textContent =
                    "Unable to connect to server.";

                adminMessage.style.color =
                    "red";

            }

        }
    );

}


// ========================================
// Load Vaccines for Admin
// ========================================

async function loadAdminVaccines() {

    const vaccinesList =
        document.getElementById(
            "adminVaccinesList"
        );


    if (!vaccinesList) {
        return;
    }


    const token = getToken();


    if (!token) {
        return;
    }


    try {

        const response = await fetch(

            API_URL +
            "/api/vaccines/view",

            {

                method: "GET",

                headers: {

                    "Authorization":
                        "Bearer " + token

                }

            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            vaccinesList.innerHTML =
                "<p>Unable to load vaccines.</p>";

            return;

        }


        if (
            !data.vaccines ||
            data.vaccines.length === 0
        ) {

            vaccinesList.innerHTML =
                "<p>No vaccines available.</p>";

            return;

        }


        vaccinesList.innerHTML = "";


        data.vaccines.forEach(function (vaccine) {

            const item =
                document.createElement("div");


            item.className =
                "data-item";


            item.innerHTML = `

                <h3>
                    ${vaccine.vaccineName}
                </h3>

                <p>
                    <strong>Description:</strong>
                    ${vaccine.description || "N/A"}
                </p>

                <p>
                    <strong>Recommended Age:</strong>
                    ${vaccine.recommendedAge || "N/A"}
                </p>

                <p>
                    <strong>Dose Number:</strong>
                    ${vaccine.doseNumber || "N/A"}
                </p>

                <br>

                <button
                    class="small-btn"
                    onclick="updateVaccine('${vaccine._id}')"
                >
                    Edit
                </button>

                <button
                    class="complete-btn"
                    onclick="deleteVaccine('${vaccine._id}')"
                >
                    Delete
                </button>

            `;


            vaccinesList.appendChild(item);

        });


    } catch (error) {

        console.log(error);

        vaccinesList.innerHTML =
            "<p>Unable to connect to server.</p>";

    }

}


// ========================================
// Delete Vaccine
// ========================================

async function deleteVaccine(vaccineId) {

    const token = getToken();


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this vaccine?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(

            API_URL +
            "/api/admin/vaccine/delete/" +
            vaccineId,

            {

                method: "DELETE",

                headers: {

                    "Authorization":
                        "Bearer " + token

                }

            }

        );


        const data =
            await response.json();


        if (response.ok) {

            alert(
                "Vaccine deleted successfully!"
            );

            loadAdminVaccines();

        } else {

            alert(
                data.message ||
                "Failed to delete vaccine."
            );

        }


    } catch (error) {

        console.log(error);

        alert(
            "Unable to connect to server."
        );

    }

}


// ========================================
// Update Vaccine
// ========================================

async function updateVaccine(vaccineId) {

    const vaccineName =
        prompt(
            "Enter new vaccine name:"
        );


    if (vaccineName === null) {
        return;
    }


    const description =
        prompt(
            "Enter new description:"
        );


    if (description === null) {
        return;
    }


    const recommendedAge =
        prompt(
            "Enter recommended age:"
        );


    if (recommendedAge === null) {
        return;
    }


    const doseNumber =
        prompt(
            "Enter dose number:"
        );


    if (doseNumber === null) {
        return;
    }


    const token = getToken();


    try {

        const response = await fetch(

            API_URL +
            "/api/admin/vaccine/update/" +
            vaccineId,

            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token

                },

                body: JSON.stringify({

                    vaccineName:
                        vaccineName,

                    description:
                        description,

                    recommendedAge:
                        recommendedAge,

                    doseNumber:
                        Number(doseNumber)

                })

            }

        );


        const data =
            await response.json();


        if (response.ok) {

            alert(
                "Vaccine updated successfully!"
            );

            loadAdminVaccines();

        } else {

            alert(
                data.message ||
                "Failed to update vaccine."
            );

        }


    } catch (error) {

        console.log(error);

        alert(
            "Unable to connect to server."
        );

    }

}


// ========================================
// Refresh Admin Vaccines
// ========================================

const refreshAdminVaccines =
    document.getElementById(
        "refreshAdminVaccines"
    );


if (refreshAdminVaccines) {

    refreshAdminVaccines.addEventListener(
        "click",
        loadAdminVaccines
    );

}


// ========================================
// Admin Logout
// ========================================

const adminLogout =
    document.getElementById(
        "adminLogout"
    );


if (adminLogout) {

    adminLogout.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "login.html";

        }
    );

}


// ========================================
// Load Admin Dashboard
// ========================================

if (addVaccineForm) {

    loadAdminVaccines();

}