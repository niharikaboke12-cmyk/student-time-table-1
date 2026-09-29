// Get users from localStorage

let users = JSON.parse(localStorage.getItem("users")) || [];

// Get exams from localStorage

let exams = JSON.parse(localStorage.getItem("exams")) || [];


// ---------------- REGISTER ----------------

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let year = document.getElementById("year").value;
        let section = document.getElementById("section").value;

        // Check existing email

        let existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {

            alert("Email already registered!");
            return;

        }

        let newUser = {

            name: name,
            email: email,
            password: password,
            role: "student",
            year: year,
            section: section

        };

        users.push(newUser);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert("Registration successful!");

        window.location.href = "login.html";

    });

}


// ---------------- LOGIN ----------------

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let email =
            document.getElementById("loginEmail").value;

        let password =
            document.getElementById("loginPassword").value;

        let role =
            document.getElementById("loginRole").value;


        // Admin login

        if (
            role === "admin" &&
            email === "admin@gmail.com" &&
            password === "admin123"
        ) {

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    name: "Administrator",
                    email: email,
                    role: "admin"
                })
            );

            window.location.href = "admin.html";

            return;
        }


        // Student login

        let user = users.find(function(user) {

            return (
                user.email === email &&
                user.password === password &&
                user.role === role
            );

        });


        if (user) {

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );

            window.location.href = "student.html";

        } else {

            alert("Invalid email, password or role!");

        }

    });

}


// ---------------- ADD EXAM ----------------

const examForm = document.getElementById("examForm");

if (examForm) {

    examForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let subject =
            document.getElementById("subject").value;

        let examDate =
            document.getElementById("examDate").value;

        let examTime =
            document.getElementById("examTime").value;

        let year =
            document.getElementById("examYear").value;

        let section =
            document.getElementById("examSection").value;

        let room =
            document.getElementById("room").value;


        let newExam = {

            id: Date.now(),

            subject: subject,

            date: examDate,

            time: examTime,

            year: year,

            section: section,

            room: room

        };


        exams.push(newExam);


        localStorage.setItem(
            "exams",
            JSON.stringify(exams)
        );


        alert("Exam added successfully!");

        examForm.reset();

        window.location.href = "timetable.html";

    });

}


// ---------------- DISPLAY TIMETABLE ----------------

function displayExams(list = exams) {

    let table =
        document.getElementById("examTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";


    if (list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8">
                    No exams found.
                </td>
            </tr>
        `;

        return;
    }


    list.forEach(function(exam, index) {

        let row = document.createElement("tr");

        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${exam.subject}</td>

            <td>${exam.date}</td>

            <td>${exam.time}</td>

            <td>${exam.year}</td>

            <td>${exam.section}</td>

            <td>${exam.room}</td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteExam(${exam.id})">
                    Delete
                </button>
            </td>

        `;

        table.appendChild(row);

    });

}


// Display exams when timetable page opens

if (document.getElementById("examTable")) {

    displayExams();

}


// ---------------- FILTER ----------------

function filterTimetable() {

    let year =
        document.getElementById("filterYear").value;

    let section =
        document.getElementById("filterSection").value;


    let filtered = exams.filter(function(exam) {

        let yearMatch =
            year === "all" ||
            exam.year === year;

        let sectionMatch =
            section === "all" ||
            exam.section === section;

        return yearMatch && sectionMatch;

    });


    displayExams(filtered);

}


// ---------------- DELETE EXAM ----------------

function deleteExam(id) {

    let confirmDelete =
        confirm("Are you sure you want to delete this exam?");

    if (!confirmDelete) {
        return;
    }


    exams =
        exams.filter(function(exam) {

            return exam.id !== id;

        });


    localStorage.setItem(
        "exams",
        JSON.stringify(exams)
    );


    displayExams();

}


// ---------------- STUDENT DETAILS ----------------

let studentName =
    document.getElementById("studentName");

if (studentName) {

    let loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );


    if (loggedInUser) {

        document.getElementById("studentName")
            .textContent = loggedInUser.name;

        document.getElementById("studentEmail")
            .textContent = loggedInUser.email;

        document.getElementById("studentYear")
            .textContent = loggedInUser.year;

        document.getElementById("studentSection")
            .textContent = loggedInUser.section;

    }

}


// ---------------- ADMIN EXAM COUNT ----------------

let totalExams =
    document.getElementById("totalExams");

if (totalExams) {

    totalExams.textContent = exams.length;

}


// ---------------- LOGOUT ----------------

function logout() {

    localStorage.removeItem("loggedInUser");

    window.location.href = "index.html";

}