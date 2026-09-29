let exams = JSON.parse(localStorage.getItem("exams")) || [];

const form = document.getElementById("examForm");
const table = document.getElementById("examTable");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    let subject = document.getElementById("subject").value;
    let branch = document.getElementById("branch").value;
    let semester = document.getElementById("semester").value;
    let date = document.getElementById("examDate").value;
    let start = document.getElementById("startTime").value;
    let end = document.getElementById("endTime").value;

    if (start >= end) {
        alert("End time must be after start time.");
        return;
    }

    // Check for timetable clash
    let clash = exams.some(exam =>
        exam.date === date &&
        start < exam.end &&
        end > exam.start
    );

    if (clash) {
        alert("Exam timing overlaps with another exam!");
        return;
    }

    let exam = {
        id: Date.now(),
        subject: subject,
        branch: branch,
        semester: semester,
        date: date,
        start: start,
        end: end
    };

    exams.push(exam);

    localStorage.setItem("exams", JSON.stringify(exams));

    form.reset();

    displayExams();
});

function displayExams() {

    table.innerHTML = "";

    exams.forEach(function(exam) {

        let row = `
            <tr>
                <td>${exam.subject}</td>
                <td>${exam.branch}</td>
                <td>${exam.semester}</td>
                <td>${exam.date}</td>
                <td>${exam.start}</td>
                <td>${exam.end}</td>
                <td>
                    <button onclick="deleteExam(${exam.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

        table.innerHTML += row;
    });
}

function deleteExam(id) {

    exams = exams.filter(exam => exam.id !== id);

    localStorage.setItem("exams", JSON.stringify(exams));

    displayExams();
}

displayExams();