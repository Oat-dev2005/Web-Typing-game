let words = [];

fetch("words.json")
  .then((res) => res.json())
  .then((data) => {
    words = data;
  });

let time = 60,
  score = 0,
  wrongLetters = 0,
  wrongWords = 0,
  combo = 0,
  highScore = 0,
  currentWord = "",
  warned = false;

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const wordElement = document.getElementById("word");
const inputElement = document.getElementById("input");
const PressStart = document.getElementById("PressStart");
const timeElement = document.getElementById("time");
const scoreElement = document.getElementById("score");
const comboElement = document.getElementById("combo");
const highScoreElement = document.getElementById("highScore");
const timeBarContainer = document.getElementById("timeBarContainer");
const timeBar = document.getElementById("timeBar");

function getRandomWord() {
  // return words[parseInt(Math.random() * words.length)];
  return words[Math.floor(Math.random() * words.length)];
}

function startGame() {
  startScreen.classList.add("hide");
  gameScreen.classList.add("show");

  score = 0;
  combo = 0;
  time = 60;
  inputElement.value = "";
  inputElement.disabled = false;
  wordElement.style.display = "block";
  inputElement.style.display = "block";
  timeBarContainer.style.display = "block";
  timeBar.style.width = "100%";
  timeBar.style.backgroundColor = "#2ecc71";

  updateWord();
  updateScore();
  updateTime();
  ShowHighScore();
  updateCombo();

  const timer = setInterval(() => {
    time--;
    updateTime();
    updateTimeBar();
    if (time <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}
function updateWord() {
  currentWord = getRandomWord();
  wordElement.textContent = currentWord.toUpperCase();
}

function updateScore() {
  scoreElement.textContent = score;
}

function updateCombo() {
  comboElement.textContent = combo;
}

function updateTime() {
  timeElement.textContent = time;
}
function updateTimeBar() {
  const percent = (time / 60) * 100;
  timeBar.style.width = percent + "%";

  // สีตามช่วงเวลา
  if (time > 40) {
    timeBar.style.backgroundColor = "#2ecc71"; // เขียว
  } else if (time > 30) {
    timeBar.style.backgroundColor = "#f1c40f"; // เหลือง
  } else if (time > 20) {
    timeBar.style.backgroundColor = "#e67e22"; // ส้ม
  } else if (time < 10) {
    timeBar.style.backgroundColor = "#e74c3c"; // แดง
    if (!warned) {
      timeBar.style.animation = "shake 0.4s infinite";
      warningSound.currentTime = 0;
      warningSound.play();
      warned = true;
    }
  }
}

function ShowHighScore() {
  const savedscore = localStorage.getItem("myHighScore");
  if (savedscore) {
    highScore = parseInt(savedscore);
    highScoreElement.textContent = highScore;
  }
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("myHighScore", highScore);
    highScoreElement.textContent = highScore;
  }
}

function endGame() {
  inputElement.disabled = true;
  warned = false;
  wordElement.style.display = "none";
  inputElement.style.display = "none";
  timeBarContainer.style.display = "none";

  alert(`Game over! Your score: ${score}`);

  startScreen.classList.remove("hide");
  gameScreen.classList.remove("show");

  updateHighScore();
  score = 0;
  time = 60;
  updateScore();
  updateTime();
}
function highlightWord(typedWord) {
  let highlightedText = "";
  for (let i = 0; i < currentWord.length; i++) {
    if (i < typedWord.length) {
      if (typedWord[i] === currentWord[i]) {
        highlightedText += `<span style="background-color: #2ecc71; color: white; padding: 2px;">${currentWord[i]}</span>`;
      } else {
        highlightedText += `<span style="background-color: #e74c3c; color: white; padding: 2px;">${currentWord[i]}</span>`;
      }
    } else {
      highlightedText += `<span style="background-color: transparent; color: white; padding: 2px;">${currentWord[i]}</span>`;
    }
  }

  wordElement.innerHTML = highlightedText.toUpperCase();
}

inputElement.addEventListener("input", () => {
  TypingSound.currentTime = 0;
  TypingSound.play();

  const typedWord = inputElement.value.toLowerCase();
  wrongLetters = 0;

  for (let i = 0; i < typedWord.length; i++) {
    if (typedWord[i] !== currentWord[i]) {
      wrongLetters++;
    }
  }

  highlightWord(typedWord, wrongLetters > 0);

  if (
    typedWord === currentWord ||
    (typedWord.length === currentWord.length && wrongLetters === 1)
  ) {
    correctSound.currentTime = 0;
    correctSound.play();
    combo++;
    updateCombo();
    // score++;
    score += combo;
    updateScore();
    inputElement.value = "";
    updateWord();
    wrongWords = 0;
  }
  if (wrongLetters >= 2) {
    wrongSound.currentTime = 0;
    wrongSound.play();
    combo = 0;
    updateCombo();
    wrongWords++;
    inputElement.value = "";
    score = Math.max(0, score - 1);
    updateScore();
    updateWord();
    wrongWords = 0;
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !gameScreen.classList.contains("show")) {
    startGame();
  }
});
PressStart.addEventListener("click", startGame);
localStorage.removeItem("myHighScore");
