/* ------------------------------
   Element References
------------------------------ */
const quizSelection = document.getElementById("quiz-selection");
const quizArea = document.getElementById("quiz-area");
const progressBar = document.getElementById("progress-bar");
const questionArea = document.getElementById("question-area");
const answerArea = document.getElementById("answer-area");
const nextQuestionButton = document.getElementById("next-question-button");
const submitQuizButton = document.getElementById("submit-quiz-button");
const resultsArea = document.getElementById("results-area");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-button");
const showAnswersButton = document.getElementById("show-answers-button");
const correctAnswersSection = document.getElementById("correct-answers-section");
const correctAnswersList = document.getElementById("correct-answers-list");

let currentQuizData = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

/* ------------------------------
   On Page Load: Parse URL Parameters
------------------------------ */
window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const topic = urlParams.get("topic");
  const subtopic = urlParams.get("subtopic");

  if (!topic) {
    alert("Error: No topic specified in the URL.");
    return;
  }

  const csvFilePath = subtopic
    ? `quizzes/${topic}/${subtopic}.csv`
    : `quizzes/${topic}/${topic}.csv`;

  loadQuizData(csvFilePath);
};

/* ------------------------------
   Load Quiz Data
------------------------------ */
function loadQuizData(csvFilePath) {
  fetch(csvFilePath)
    .then(response => {
      if (!response.ok) throw new Error(`Quiz file not found: ${csvFilePath}`);
      return response.text();
    })
    .then(csvData => {
      currentQuizData = parseCSV(csvData);
      currentQuizData.forEach(q => (q.answered = false));

      quizSelection.style.display = "none";
      quizArea.style.display = "block";
      resultsArea.style.display = "none";
      correctAnswersSection.style.display = "none";

      displayQuestion();
    })
    .catch(error => alert(error.message));
}

/* ------------------------------
   Parse CSV
------------------------------ */
function parseCSV(csvString) {
  const rows = csvString.trim().split("\n");
  const header = rows.shift().split(",").map(h => h.trim());

  return rows.map(line => {
    const values = line.split(",").map(v => v.trim());
    return header.reduce((obj, key, i) => ({ ...obj, [key]: values[i] || "" }), {});
  });
}

/* ------------------------------
   Display Current Question
------------------------------ */
function displayQuestion() {
  const questionData = currentQuizData[currentQuestionIndex];
  questionArea.textContent = questionData.question;
  answerArea.innerHTML = "";

  for (let i = 1; i <= 4; i++) {
    if (questionData[`answer${i}`]) {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "answer";
      checkbox.value = i;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(questionData[`answer${i}`]));
      answerArea.appendChild(label);
    }
  }

  updateProgressBar();
  nextQuestionButton.disabled = false;
  submitQuizButton.style.display = "none";
}

/* ------------------------------
   Update Progress Bar
------------------------------ */
function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / currentQuizData.length) * 100;
  progressBar.style.width = `${progress}%`;
}

/* ------------------------------
   Next Question
------------------------------ */
nextQuestionButton.addEventListener("click", () => {
  const selectedAnswers = Array.from(
    document.querySelectorAll('input[name="answer"]:checked')
  ).map(input => parseInt(input.value));

  userAnswers[currentQuestionIndex] = selectedAnswers;
  checkAnswer(selectedAnswers);

  currentQuestionIndex++;

  if (currentQuestionIndex < currentQuizData.length) {
    displayQuestion();
  } else {
    nextQuestionButton.style.display = "none";
    submitQuizButton.style.display = "inline-block";
  }
});

/* ------------------------------
   Check Answer
------------------------------ */
function checkAnswer(selectedAnswers) {
  const correctAnswers = currentQuizData[currentQuestionIndex]
    .correct_answers.split(";")
    .map(v => parseInt(v.trim(), 10));

  const correctCount = selectedAnswers.filter(ans => correctAnswers.includes(ans)).length;
  const questionScore = correctCount / correctAnswers.length;

  score += questionScore;
}

/* ------------------------------
   Submit Quiz
------------------------------ */
submitQuizButton.addEventListener("click", () => {
  quizArea.style.display = "none";
  resultsArea.style.display = "block";
  scoreDisplay.textContent = `You scored ${Math.round(score)} out of ${currentQuizData.length}`;
});

/* ------------------------------
   Restart Quiz
------------------------------ */
restartButton.addEventListener("click", () => location.reload());

/* ------------------------------
   Show Correct Answers
------------------------------ */
showAnswersButton.addEventListener("click", () => {
  correctAnswersSection.style.display = "block";
  correctAnswersList.innerHTML = currentQuizData
    .map(
      (q, i) => `
      <h3>Question ${i + 1}: ${q.question}</h3>
      <p>Correct Answers: ${q.correct_answers.replace(/;/g, ", ")}</p>
    `
    )
    .join("");
});
