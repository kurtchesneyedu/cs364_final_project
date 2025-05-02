//DOCUMENTATION STATEMENT: We used ChatGPT to create date (insert test row date, etc) and
//also github copilot was used sparingly. We use L27 demo code (all of it)
//We used ChatGPT to get the CSS working, it told us to insert include mimetypes in nginx.conf
//Used class resources, slides, examples, etc.

//file: dashboard.js
// used by dashboard.html to fetch users from the database
// and udpate HTML table with user data

async function fetchUsers() {
    const response = await fetch("/api/users", { credentials: "include" });
    const users = await response.json();

    if (response.ok) {
        // get HTML table (going to modify this)
        const userTable = document.getElementById("userList");
        userTable.innerHTML = ""; // clear the previous content of the table

        // for each user in result, create table row and append to table in DOM
        users.forEach(user => {  
            const row = document.createElement("tr");
            row.innerHTML = `<td>${user.username}</td><td>${user.email}</td><td>${user.role}</td>`;
            userTable.appendChild(row);
        });

    } else {
        alert("Unauthorized access!"); // comment this out when confident
        window.location.href = "/frontpage.html";
    }
}

async function fetchTimers(limit = "all") {
    const response = await fetch("/api/timers", { credentials: "include" });
    const timers = await response.json();

    if (!response.ok) {
        alert("Could not load timer results.");
        return;
    }

    const table = document.getElementById("timerList");
    table.innerHTML = "";

    // Sort by newest first
    const sortedTimers = timers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Determine how many to display
    let displayTimers = sortedTimers;
    if (limit !== "all") {
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum)) {
            displayTimers = sortedTimers.slice(0, limitNum);
        }
    }

    // Debug logs
    console.log("Limit selected:", limit);
    console.log("Displaying timers:", displayTimers.length);

    // Render rows
    displayTimers.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.username}</td>
            <td>${entry.sport}</td>
            <td>${entry.team}</td>
            <td>${entry.athlete}</td>
            <td>${entry.event}</td>
            <td>${entry.elapsed}</td>
            <td>${new Date(entry.created_at).toLocaleString()}</td>
        `;
        table.appendChild(row);
    });
}



// Truncate (Clear All Timers)
async function clearTimers() {
    if (!confirm("Are you sure you want to delete all timer entries?")) return;

    const response = await fetch("/api/timers", {
        method: "DELETE",
        credentials: "include"
    });

    if (response.ok) {
        fetchTimers(); // refresh after deletion
    } else {
        alert("Failed to clear timers.");
    }
}

//insert hardcoded test data
async function insertTestRow() {
    const response = await fetch("/api/timers/test", {
      method: "POST",
      credentials: "include"
    });
  
    const result = await response.json();
    if (result.success) {
      alert("Test row inserted!");
      fetchTimers();
    } else {
      alert("Failed to insert test row.");
    }
  }  


document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();

    const timerLimitSelect = document.getElementById("timerLimit");
    fetchTimers(timerLimitSelect.value); // use selected value on load

    timerLimitSelect.addEventListener("change", (e) => {
        fetchTimers(e.target.value); // update on change
    });

    document.getElementById("clearTimersBtn").addEventListener("click", clearTimers);
    document.getElementById("insertTestBtn").addEventListener("click", insertTestRow);
});




