var currentDropdown = null;
var mainButtonState = 0; // 0 = START, 1 = SPLIT, 2 = STOP
var timerInterval = null;
var startTime = null;
var elapsedTime = 0;
var timerHistory = [];

function updateSportButton(element) {
  var button = document.getElementById("sport-btn");
  button.textContent = element.textContent;
}

function updateTeamButton(element) {
  var button = document.getElementById("team-btn");
  button.textContent = element.textContent;
}

function updateAthleteButton(element) {
  var button = document.getElementById("athlete-btn");
  button.textContent = element.textContent;
}

function updateEventButton(element) {
  var button = document.getElementById("event-btn");
  button.textContent = element.textContent;
}

function updateMainButton() {
  var mainButton = document.getElementById("main-button");
  switch (mainButtonState) {
    case 0:
      mainButton.textContent = "SPLIT";
      startTimer();
      addTimerEntry("Start");
      mainButtonState = 1;
      break;
    case 1:
      mainButton.textContent = "STOP";
      addTimerEntry("Split");
      mainButtonState = 2;
      break;
    case 2:
        mainButton.textContent = "START";
        stopTimer();
        addTimerEntry("Stop", new Date().getTime() - startTime);
        mainButtonState = 0;
        break;
  }
}

function resetMainButton() {
  var mainButton = document.getElementById("main-button");
  mainButton.textContent = "START";
  mainButtonState = 0;
  stopTimer();
  resetTimer();
  clearTimerTable();
}

function startTimer() {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 10);
}

function stopTimer() {
  clearInterval(timerInterval);
  elapsedTime += new Date().getTime() - startTime;
}

function resetTimer() {
  elapsedTime = 0;
  updateTimerDisplay("00:00:00.00");
  timerHistory = [];
  updateTimerTable();
}

function updateTimer() {
  var currentTime = new Date().getTime() - startTime + elapsedTime;
  updateTimerDisplay(formatTime(currentTime));
}

function updateTimerDisplay(timeString) {
  document.getElementById("timer").textContent = timeString;
}

function formatTime(time) {
  var milliseconds = Math.floor((time % 1000) / 10);
  var seconds = Math.floor((time / 1000) % 60);
  var minutes = Math.floor((time / (1000 * 60)) % 60);
  var hours = Math.floor((time / (1000 * 60 * 60)) % 24);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

function addTimerEntry(label, time = null) {
    var currentTime = time || new Date().getTime() - startTime + elapsedTime;
    var formattedTime = formatTime(currentTime);
    timerHistory.push({ time: formattedTime, label: label });
    updateTimerTable();
}

function updateTimerTable() {
    var timerTableBody = document.getElementById("timer-table-body");
    timerTableBody.innerHTML = "";
  
    for (var i = 0; i < timerHistory.length; i++) {
      var row = document.createElement("tr");
      var timeCell = document.createElement("td");
      var labelCell = document.createElement("td");
  
      timeCell.textContent = timerHistory[i].time;
      labelCell.textContent = timerHistory[i].label;
  
      row.appendChild(timeCell);
      row.appendChild(labelCell);
      timerTableBody.appendChild(row);
    }
}

// Add event listeners to the buttons
document.getElementById("main-button").addEventListener("click", updateMainButton);
document.getElementById("reset-button").addEventListener("click", resetMainButton);

document.querySelectorAll(".dropdown-btn").forEach(function(btn) {
  btn.addEventListener("click", toggleDropdown);
});

document.querySelectorAll(".dropdown-content a").forEach(function(link) {
  link.addEventListener("click", function() {
    toggleDropdown();
    var dropdownId = this.parentElement.parentElement.id.replace("-dropdown", "-btn");
    var dropdownBtn = document.getElementById(dropdownId);
    updateDropdownButton(dropdownBtn, this);
  });
});

function toggleDropdown() {
  var dropdowns = document.getElementsByClassName("dropdown-content");
  for (var i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains("show")) {
      openDropdown.classList.remove("show");
    }
  }
  currentDropdown = currentDropdown === null ? this : null;
  this.classList.toggle("show");
}

function updateDropdownButton(button, element) {
  button.textContent = element.textContent;
}