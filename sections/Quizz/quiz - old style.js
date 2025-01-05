/* ------------------------------
   Element References
------------------------------ */
const quizSelection = document.getElementById("quiz-selection");
const quizArea = document.getElementById("quiz-area");
const questionArea = document.getElementById("question-area");
const answerArea = document.getElementById("answer-area");
const nextQuestionButton = document.getElementById("next-question-button");
const submitQuizButton = document.getElementById("submit-quiz-button");
const resultsArea = document.getElementById("results-area");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-button");

// New references for correct answers
const showAnswersButton = document.getElementById("show-answers-button");
const correctAnswersSection = document.getElementById("correct-answers-section");
const correctAnswersList = document.getElementById("correct-answers-list");

let currentQuizData = [];
let currentQuestionIndex = 0;
let score = 0;

// Array to store user’s selected answers for each question.
let userAnswers = [];

/* ------------------------------
   On Page Load: Parse URL Parameters
------------------------------ */
window.onload = () => {
  console.log("[window.onload] Loading quiz based on URL parameters...");

  // Get the topic and subtopic from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const topic = urlParams.get("topic");
  const subtopic = urlParams.get("subtopic");

  if (!topic) {
    alert("Error: No topic specified in the URL.");
    return;
  }

  // Determine the CSV file path
  let csvFilePath = "";
  if (!subtopic || subtopic === "all") {
    // Load topic-level quiz if subtopic is not provided or is "all"
    csvFilePath = `quizzes/${topic}/${topic}.csv`;
  } else {
    // Load subtopic-level quiz
    csvFilePath = `quizzes/${topic}/${subtopic}.csv`;
  }

  console.log(`[window.onload] Topic: ${topic}, Subtopic: ${subtopic}`);
  console.log(`[window.onload] Using CSV file path: ${csvFilePath}`);

  // Load the quiz data
  loadQuizData(csvFilePath);
};

/* ------------------------------
   Load Quiz Data
------------------------------ */
function loadQuizData(csvFilePath) {
    console.log(`[loadQuizData] Fetching quiz data from: ${csvFilePath}`);
    fetch(csvFilePath)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Quiz file not found: ${csvFilePath}`);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        return response.text();
      })
      .then(csvData => {
        console.log("[loadQuizData] Parsing quiz CSV data...");
        currentQuizData = parseCSV(csvData);
        console.log(`[loadQuizData] Found ${currentQuizData.length} questions`);
  
        // Mark each question as not answered yet
        currentQuizData.forEach(q => q.answered = false);
  
        // Show quiz area, hide selection area
        quizSelection.style.display = "none";
        quizArea.style.display = "block";
        resultsArea.style.display = "none";
        correctAnswersSection.style.display = "none"; // hide the correct answers section if it was open
  
        displayQuestion();
      })
      .catch(error => {
        console.error("[loadQuizData] Error loading or parsing CSV:", error);
        alert(error.message);
      });
  }
  
  /* ------------------------------
     Parse CSV (Trimming Headers and Values)
  ------------------------------ */
  function parseCSV(csvString) {
    // Split into lines
    const rows = csvString.trim().split('\n');
    // Separate the header line and split
    // Trim each header element to remove trailing spaces
    const header = rows.shift().split(',').map(h => h.trim());
  
    console.log("[parseCSV] Header columns:", header.join(", "));
    console.log("[parseCSV] Number of data rows:", rows.length);
  
    return rows.map((line, rowIndex) => {
      // Remove trailing \r if present
      line = line.replace(/\r$/, '');
      const values = line.split(',').map(v => v.trim());
  
      const obj = {};
      header.forEach((key, i) => {
        // Assign each trimmed value to the matching key
        obj[key] = values[i] || "";
      });
  
      console.log(`[parseCSV] Row #${rowIndex + 1}`, obj);
      return obj;
    });
  }
  

/* ------------------------------
   Display Current Question
------------------------------ */
function displayQuestion() {
  if (currentQuestionIndex >= currentQuizData.length) {
    return;
  }

  const questionData = currentQuizData[currentQuestionIndex];
  questionArea.textContent = questionData.question;
  answerArea.innerHTML = "";

  // Display answers (1 to 4)
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
      answerArea.appendChild(document.createElement("br"));
    }
  }

  // Re-enable next question button
  nextQuestionButton.style.display = "inline-block";
  nextQuestionButton.disabled = false;

  // Hide submit button initially
  submitQuizButton.style.display = "none";
}

/* ------------------------------
   Next Question
------------------------------ */
nextQuestionButton.addEventListener("click", () => {
  const selectedAnswers = Array
    .from(document.querySelectorAll('input[name="answer"]:checked'))
    .map(input => parseInt(input.value));

  userAnswers[currentQuestionIndex] = selectedAnswers;

  // Check if this question is not answered yet
  if (!currentQuizData[currentQuestionIndex].answered) {
    checkAnswer(selectedAnswers);
    currentQuizData[currentQuestionIndex].answered = true;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < currentQuizData.length) {
    displayQuestion();
  } else {
    nextQuestionButton.style.display = "none";
    submitQuizButton.style.display = "inline-block";
  }
});

/* ------------------------------
   Submit Quiz
------------------------------ */
submitQuizButton.addEventListener("click", () => {
  quizArea.style.display = "none";
  resultsArea.style.display = "block";

  const finalScore = Math.round(score * 100) / 100;
  scoreDisplay.textContent = `You got ${finalScore} out of ${currentQuizData.length} questions.`;

  showAnswersButton.style.display = "inline-block";
});

/* ------------------------------
   Check Answer
------------------------------ */
function checkAnswer(selectedAnswers) {
  const questionData = currentQuizData[currentQuestionIndex];
  const correctAnswers = questionData.correct_answers.split(";").map(v => parseInt(v.trim(), 10));

  let correctCount = 0;
  selectedAnswers.forEach(ans => {
    if (correctAnswers.includes(ans)) {
      correctCount++;
    }
  });

  const questionScore = correctCount / correctAnswers.length;
  score += questionScore;
}

/* ------------------------------
   Restart Quiz
------------------------------ */
restartButton.addEventListener("click", () => {
  location.reload(); // Reload the page
});


/* ------------------------------
   Show Correct Answers
------------------------------ */
showAnswersButton.addEventListener("click", () => {
    // Show the correct answers section
    correctAnswersSection.style.display = "block";
  
    // Build out the correct answers list
    displayCorrectAnswers();
  });
  
  /* ------------------------------
     Function to Display Correct Answers
  ------------------------------ */
  function displayCorrectAnswers() {
    correctAnswersList.innerHTML = ""; // Clear old data if any
  
    currentQuizData.forEach((questionData, index) => {
      // Question Title
      const questionTitle = document.createElement("h3");
      questionTitle.textContent = `Question ${index + 1}: ${questionData.question}`;
      correctAnswersList.appendChild(questionTitle);
  
      // Clean up correct answers
      const cleanCorrectAnswers = (questionData.correct_answers || "")
        .replace(/"/g, "")
        .replace(/\r$/, "")
        .trim();
  
      const correctAnswersArr = cleanCorrectAnswers
        .split(';')
        .filter(v => v !== "")
        .map(v => parseInt(v, 10));
  
      // User's selected answers
      const userSelected = userAnswers[index] || [];
  
      // Loop through possible 4 answers
      for (let i = 1; i <= 4; i++) {
        if (!questionData[`answer${i}`]) continue; // skip empty answers
  
        const answerText = questionData[`answer${i}`];
        const isCorrect = correctAnswersArr.includes(i);
        const isSelected = userSelected.includes(i);
  
        // Create a <p> element to show each option
        const answerLine = document.createElement("p");
  
        // Mark correct answers in green, wrong user picks in red, etc.
        if (isCorrect && isSelected) {
          // Correct and selected → highlight green
          answerLine.style.color = "green";
          answerLine.textContent = `✓ (Option ${i}) ${answerText}  [You chose this correctly]`;
        } else if (isCorrect) {
          // Correct answer, but user did not select it
          answerLine.style.color = "blue";
          answerLine.textContent = `Correct (Option ${i}) ${answerText} [You missed this one]`;
        } else if (isSelected) {
          // User selected, but it's not correct
          answerLine.style.color = "red";
          answerLine.textContent = `✗ (Option ${i}) ${answerText} [Incorrect pick]`;
        } else {
          // Not correct, not selected
          answerLine.style.color = "black";
          answerLine.textContent = `(Option ${i}) ${answerText}`;
        }
  
        correctAnswersList.appendChild(answerLine);
      }
  
      // Optional: a horizontal rule between questions
      correctAnswersList.appendChild(document.createElement("hr"));
    });
  }