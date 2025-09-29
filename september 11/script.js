let currentQuestion = 0;
let userAnswers = [];
let questions = [];
let userName = "";
let showLeaderboard = true;
let useTimer = true;
let startTime = 0;

const screens = {
  landing: document.querySelector(".screen--landing"),
  name: document.querySelector(".screen--name"),
  quiz: document.querySelector(".screen--quiz"),
  results: document.querySelector(".screen--results")
};

const startBtn = document.querySelector(".btn--start");
const nameForm = document.querySelector(".name__form");
const nameInput = document.querySelector(".name__input");
const nextQuestionBtn = document.querySelector(".btn--next-question");
const showResultsBtn = document.querySelector(".btn--show-results");
const questionText = document.querySelector(".quiz__question-text");
const progressText = document.querySelector(".quiz__progress-text");
const choiceButtons = document.querySelectorAll(".btn--choice");

startBtn.addEventListener("click", () => {
  screens.landing.classList.remove("active");
  screens.name.classList.add("active");
});

document.querySelector(".btn--back").addEventListener("click", () => {
  screens.name.classList.remove("active");
  screens.landing.classList.add("active");
});

document.querySelector(".btn--clear-leaderboards").addEventListener("click", () => {
  localStorage.removeItem("scoreLeaderboard");
  localStorage.removeItem("timeLeaderboard");
  loadLeaderboards();
});

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userName = nameInput.value.trim();
  showLeaderboard = document.querySelector('input[name="leaderboard"]:checked').value === "yes";
  useTimer = document.querySelector('input[name="timer"]:checked').value === "yes";

  if (!questions.length) {
    alert("Questions not loaded yet. Please wait a moment and try again.");
    return;
  }

  if (userName) {
    screens.name.classList.remove("active");
    screens.quiz.classList.add("active");
    startTime = performance.now();
    loadQuestion();
  }
});

progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;


fetch("questions.json")
  .then((res) => {
    if (!res.ok) throw new Error("Failed to load questions");
    return res.json();
  })
  .then((data) => {
    questions = shuffle(data).slice(0, 10); // Pick 10 random questions
  })
  .catch((err) => {
    alert("Error loading quiz questions.");
    console.error(err);
  });

function shuffle(array) {
  let copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function loadQuestion() {
  if (!questions.length) return;

  const q = questions[currentQuestion];
  questionText.textContent = q.question;
  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

  choiceButtons.forEach(btn => {
    btn.classList.remove("selected");
    if (
      userAnswers[currentQuestion] !== undefined &&
      btn.dataset.choice === String(userAnswers[currentQuestion])
    ) {
      btn.classList.add("selected");
    }
  });

  nextQuestionBtn.style.display = "inline-block";
  showResultsBtn.style.display = "none";
  nextQuestionBtn.textContent = currentQuestion === questions.length - 1 ? "Finish" : "Next";
}

choiceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    userAnswers[currentQuestion] = btn.dataset.choice === "true";
    choiceButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

nextQuestionBtn.addEventListener("click", () => {
  if (userAnswers[currentQuestion] === undefined) {
    alert("Please select an answer before continuing.");
    return;
  }

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    nextQuestionBtn.style.display = "none";
    showResultsBtn.style.display = "inline-block";
  }
});

showResultsBtn.addEventListener("click", () => {
  showResults();
});

function showResults() {
  let score = 0;
  const resultList = document.querySelector(".results__list");
  const resultTitle = document.querySelector(".results__title");
  const resultTime = document.querySelector(".results__time");

  resultList.innerHTML = "";

  questions.forEach((q, i) => {
    const isCorrect = userAnswers[i] === q.isTrue;
    if (isCorrect) score++;

    const item = document.createElement("li");
    item.classList.add("results__item");
    item.innerHTML = `
      <strong>Q${i + 1}:</strong> ${q.question}<br />
      Your answer: <em>${userAnswers[i] ? "Real" : "Fake"}</em> ${isCorrect ? "✅" : "❌"}<br />
      Correct answer: <em>${q.isTrue ? "Real" : "Fake"}</em>
    `;
    resultList.appendChild(item);
  });

  const timeTaken = Math.floor((performance.now() - startTime) / 1000);
  resultTitle.textContent = `${userName}, you got ${score} out of ${questions.length} correct!`;
  resultTime.textContent = `Time taken: ${timeTaken}s`;

  if (showLeaderboard) {
    const scoreEntry = { name: userName, score: score, total: questions.length };
    const timeEntry = { name: userName, time: timeTaken };

    const scoreBoard = JSON.parse(localStorage.getItem("scoreLeaderboard") || "[]");
    const timeBoard = JSON.parse(localStorage.getItem("timeLeaderboard") || "[]");

    scoreBoard.push(scoreEntry);
    timeBoard.push(timeEntry);

    scoreBoard.sort((a, b) => b.score - a.score);
    timeBoard.sort((a, b) => a.time - b.time);

    localStorage.setItem("scoreLeaderboard", JSON.stringify(scoreBoard));
    localStorage.setItem("timeLeaderboard", JSON.stringify(timeBoard));
  }

  screens.quiz.classList.remove("active");
  screens.results.classList.add("active");
}

document.querySelector(".btn--return").addEventListener("click", () => {
  resetQuiz();
});

function resetQuiz() {
  currentQuestion = 0;
  userAnswers = [];
  screens.results.classList.remove("active");
  screens.landing.classList.add("active");
  loadLeaderboards();
}

function loadLeaderboards() {
  const scoreData = JSON.parse(localStorage.getItem("scoreLeaderboard") || "[]");
  const timeData = JSON.parse(localStorage.getItem("timeLeaderboard") || "[]");

  const scoreList = document.getElementById("scoreLeaderboard");
  const timeList = document.getElementById("timeLeaderboard");

  scoreList.innerHTML = "";
  timeList.innerHTML = "";

  scoreData.slice(0, 3).forEach((entry, index) => {
    const li = document.createElement("li");
    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
    li.textContent = `${medal} ${entry.name} – ${entry.score}/${entry.total}`;
    scoreList.appendChild(li);
  });

  timeData.slice(0, 3).forEach((entry, index) => {
    const li = document.createElement("li");
    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
    li.textContent = `${medal} ${entry.name} – ${entry.time}s`;
    timeList.appendChild(li);
  });
}

loadLeaderboards();

document.querySelector(".btn--replay").addEventListener("click", () => {
  currentQuestion = 0;
  userAnswers = [];

  fetch("questions.json")
    .then((res) => res.json())
    .then((data) => {
      questions = shuffle(data).slice(0, 10);
      screens.results.classList.remove("active");
      screens.quiz.classList.add("active");
      startTime = performance.now();
      loadQuestion();
    });
});

