// Initialize leaderboard data
let users = JSON.parse(localStorage.getItem("users")) || [
    { name: "Alice", points: 120 },
    { name: "Bob", points: 100 },
    { name: "Charlie", points: 90 }
];

// Save leaderboard to localStorage
function saveLeaderboard() {
    localStorage.setItem("users", JSON.stringify(users));
}

// Render leaderboard
function renderLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    if (!leaderboard) return;

    leaderboard.innerHTML = "";
    users.sort((a, b) => b.points - a.points);

    users.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${user.name}: ${user.points} points`;
        leaderboard.appendChild(listItem);
    });
}

// Add points to a user
function addPoints(username, points) {
    const user = users.find((u) => u.name === username);
    if (user) {
        user.points += points;
        saveLeaderboard();
        renderLeaderboard();
        return true; // Success
    }
    return false; // User not found
}

// Handle username submission
document.getElementById("username-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById("username").value.trim();
    const messageDiv = document.getElementById("username-message");

    if (users.find((user) => user.name === usernameInput)) {
        localStorage.setItem("currentUser", usernameInput);
        messageDiv.textContent = `Welcome, ${usernameInput}!`;
        messageDiv.style.color = "green";
    } else {
        messageDiv.textContent = "User invalid";
        messageDiv.style.color = "red";
    }
});

// Prevent access to pages if username isn't entered
function validateUsername(targetPage) {
    const currentUser = localStorage.getItem("currentUser");
    const messageDiv = document.getElementById("username-message") || document.createElement("div");

    if (!currentUser) {
        messageDiv.textContent = "Please insert username";
        messageDiv.style.color = "red";
        messageDiv.style.marginTop = "10px";
        messageDiv.id = "username-message";
        document.querySelector("main").appendChild(messageDiv);
    } else {
        window.location.href = targetPage;  // Redirect to the desired page
    }
}

// Attach event listeners for the links to validate the username before navigating
document.getElementById("daily-challenge-link")?.addEventListener("click", (e) => {
    e.preventDefault();  // Prevent default link behavior
    validateUsername("challenge.html");  // Call validateUsername with the target page
});

document.getElementById("trivia-link")?.addEventListener("click", (e) => {
    e.preventDefault();  // Prevent default link behavior
    validateUsername("trivia.html");  // Call validateUsername with the target page
});

// Daily Challenge
document.getElementById("challenge-btn")?.addEventListener("click", () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser || !addPoints(currentUser, 10)) {
        alert("User invalid");
    } else {
        alert("Congratulations! You have gained 10 points!");
        window.location.href = "leaderboard.html";
    }
});

// Trivia Answer Check
function checkAnswer(answer) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser || !users.find((user) => user.name === currentUser)) {
        alert("User invalid");
        window.location.href = "leaderboard.html";
        return;
    }

    if (answer === "correct") {
        alert("Congratulations! You have gained 10 points!");
        addPoints(currentUser, 10);
    } else {
        alert("Sorry! Wrong answer. Correct Answer is: 85 dB.");
    }
    window.location.href = "leaderboard.html";
}

// Add event listeners to trivia answer buttons
document.getElementById("answer-1")?.addEventListener("click", () => checkAnswer("correct"));
document.getElementById("answer-2")?.addEventListener("click", () => checkAnswer("wrong"));
document.getElementById("answer-3")?.addEventListener("click", () => checkAnswer("wrong"));

// Initialize leaderboard on page load
window.onload = renderLeaderboard;
