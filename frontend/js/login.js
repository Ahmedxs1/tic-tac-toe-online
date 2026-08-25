const nameField = document.getElementById("player-name");
const form = document.querySelector("form");



form.addEventListener("submit", (event) => {
    event.preventDefault();

    const playerName = nameField.value;

    if (playerName.length < 4) {
        alert("name length should be at least 5 chars");
        return;
    }

    localStorage.setItem("playerName", playerName);
    window.location.href = "index.html"

});
