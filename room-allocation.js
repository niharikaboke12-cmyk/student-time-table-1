let exams =
    JSON.parse(localStorage.getItem("exams")) || [];

let rooms =
    JSON.parse(localStorage.getItem("rooms")) || [];

let allocations =
    JSON.parse(localStorage.getItem("allocations")) || [];

const examSelect =
    document.getElementById("examSelect");

const roomSelect =
    document.getElementById("roomSelect");

const form =
    document.getElementById("allocationForm");

const table =
    document.getElementById("allocationTable");


// Load exams
function loadExams() {

    examSelect.innerHTML =
        '<option value="">Select Exam</option>';

    exams.forEach(function(exam) {

        let option =
            document.createElement("option");

        option.value = exam.id;

        option.textContent =
            `${exam.subject} - ${exam.date} (${exam.start}-${exam.end})`;

        examSelect.appendChild(option);

    });
}


// Load rooms
function loadRooms() {

    roomSelect.innerHTML =
        '<option value="">Select Room</option>';

    rooms.forEach(function(room) {

        let option =
            document.createElement("option");

        option.value = room.id;

        option.textContent =
            `${room.roomNumber} - Capacity ${room.capacity}`;

        roomSelect.appendChild(option);

    });
}


// Allocate room
form.addEventListener("submit", function(event) {

    event.preventDefault();

    let examId =
        Number(examSelect.value);

    let roomId =
        Number(roomSelect.value);

    let exam =
        exams.find(e => e.id === examId);

    let room =
        rooms.find(r => r.id === roomId);

    if (!exam || !room) {

        alert("Please select exam and room.");

        return;
    }


    // Check whether room is already allocated
    let roomClash = allocations.some(function(allocation) {

        let existingExam =
            exams.find(e => e.id === allocation.examId);

        return (
            allocation.roomId === roomId &&
            existingExam &&
            existingExam.date === exam.date &&
            exam.start < existingExam.end &&
            exam.end > existingExam.start
        );

    });


    if (roomClash) {

        alert(
            "Room is already allocated during this exam time!"
        );

        return;
    }


    let allocation = {

        id: Date.now(),

        examId: examId,

        roomId: roomId

    };


    allocations.push(allocation);

    localStorage.setItem(
        "allocations",
        JSON.stringify(allocations)
    );


    alert("Room allocated successfully!");

    displayAllocations();

});


function displayAllocations() {

    table.innerHTML = "";

    allocations.forEach(function(allocation) {

        let exam =
            exams.find(e => e.id === allocation.examId);

        let room =
            rooms.find(r => r.id === allocation.roomId);


        if (!exam || !room) {
            return;
        }


        let row = `

            <tr>

                <td>${exam.subject}</td>

                <td>${exam.date}</td>

                <td>
                    ${exam.start} - ${exam.end}
                </td>

                <td>
                    ${room.roomNumber}
                </td>

                <td>

                    <button
                        onclick="deleteAllocation(${allocation.id})">

                        Remove

                    </button>

                </td>

            </tr>

        `;


        table.innerHTML += row;

    });

}


function deleteAllocation(id) {

    allocations =
        allocations.filter(
            a => a.id !== id
        );

    localStorage.setItem(
        "allocations",
        JSON.stringify(allocations)
    );

    displayAllocations();

}


loadExams();

loadRooms();

displayAllocations();