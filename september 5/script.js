window.onload = function () {
    let randomNumber;
    let guessCounter = 0;
    let maxRange = 100;
    let playerName = "";
    let modeLabel = "";

    const homeScreen = document.getElementById("homeScreen");
    const nameScreen = document.getElementById("nameScreen");
    const gameScreen = document.getElementById("gameScreen");

    const difficultyButtons = homeScreen.querySelectorAll("button[data-range]");
    const clearBtn = document.getElementById("clearBtn");
    const leaderboardList = document.getElementById("leaderboardList");

    const nameInput = document.getElementById("nameInput");
    const startGameBtn = document.getElementById("startGameBtn");
    const backToHome = document.getElementById("backToHome");

    const guessInput = document.getElementById("guessInput");
    const submitButton = document.getElementById("submitGuess");
    const feedback = document.getElementById("feedback");
    const guessCount = document.getElementById("guessCount");
    const rangeLabel = document.getElementById("rangeLabel");
    const backButton = document.getElementById("backButton");

    difficultyButtons.forEach(button => {
        button.addEventListener("click", () => {
            maxRange = Number(button.getAttribute("data-range"));
            modeLabel = getModeLabel(maxRange);
            homeScreen.style.display = "none";
            nameScreen.style.display = "block";
        });
    });

    startGameBtn.addEventListener("click", () => {
        playerName = nameInput.value.trim();
        if (!playerName) playerName = "Mystery Player";
        nameInput.value = "";
        nameScreen.style.display = "none";
        gameScreen.style.display = "block";
        setupGame();
    });

    backToHome.addEventListener("click", () => {
        nameScreen.style.display = "none";
        homeScreen.style.display = "block";
    });

    backButton.addEventListener("click", () => {
        gameScreen.style.display = "none";
        homeScreen.style.display = "block";
        updateLeaderboard();
    });

    clearBtn.addEventListener("click", () => {
        localStorage.removeItem("leaderboard");
        updateLeaderboard();
    });

    submitButton.addEventListener("click", checkGuess);

    function getModeLabel(range) {
        if (range === 20) return "Easy";
        if (range === 100) return "Medium";
        if (range === 500) return "Hard";
        if (range === 1000) return "Impossible";
        return `1–${range}`;
    }

    function setupGame() {
        randomNumber = Math.floor(Math.random() * maxRange) + 1;
        guessCounter = 0;

        rangeLabel.textContent = `Pick a number between 1 and ${maxRange}`;
        feedback.textContent = "";
        guessCount.textContent = "";
        guessInput.value = "";
        guessInput.disabled = false;
        submitButton.disabled = false;
        guessInput.focus();
    }

    function checkGuess() {
        const userGuess = Number(guessInput.value);
        guessCounter++;

        if (!userGuess || userGuess < 1 || userGuess > maxRange) {
            feedback.textContent = `⛔ Enter a number between 1 and ${maxRange}.`;
            return;
        }

        if (userGuess === randomNumber) {
            feedback.textContent = `🎉 Congratulations, ${playerName}! You guessed it in ${guessCounter} tries.`;
            guessInput.disabled = true;
            submitButton.disabled = true;
            saveScore(playerName, guessCounter, modeLabel);
            updateLeaderboard();
        } else if (userGuess < randomNumber) {
            feedback.textContent = "📉 Too low. Try again!";
        } else {
            feedback.textContent = "📈 Too high. Try again!";
        }

        guessCount.textContent = `Guesses: ${guessCounter}`;
        guessInput.value = "";
        guessInput.focus();
    }

    function saveScore(name, guesses, mode) {
        let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
        scores.push({ name, guesses, mode });
        localStorage.setItem("leaderboard", JSON.stringify(scores));
    }

    function updateLeaderboard() {
        let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
        scores.sort((a, b) => a.guesses - b.guesses);

        leaderboardList.innerHTML = "";
        scores.forEach(score => {
            const item = document.createElement("li");
            item.textContent = `${score.name} – ${score.mode} – ${score.guesses} guesses`;
            leaderboardList.appendChild(item);
        });
    }

    updateLeaderboard();
};
