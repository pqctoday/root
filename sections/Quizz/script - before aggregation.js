/* ==========================
   QUIZ SCRIPT WITH
   "SHOW CORRECT ANSWERS"
========================== */

/* ------------------------------
   Element References
------------------------------ */
const topicDropdown = document.getElementById("topic-dropdown");
const subtopicDropdown = document.getElementById("subtopic-dropdown");
const startQuizButton = document.getElementById("start-quiz-button");
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
   On Page Load: Load Topics
------------------------------ */
window.onload = () => {
  console.log("[window.onload] Loading topics...");
  loadTopics();
};

/* ------------------------------
   Function to Load Topics
------------------------------ */
function loadTopics() {
  console.log("[loadTopics] Fetching quizzes/topics.csv...");
  fetch('quizzes/topics.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("[loadTopics] topics.csv fetched successfully");
      return response.text();
    })
    .then(csvData => {
      console.log("[loadTopics] Parsing topics CSV data");
      const topics = parseCSV(csvData);
      console.log(`[loadTopics] Found ${topics.length} topics`);

      topics.forEach(topic => {
        const option = document.createElement("option");
        // 'topic_name' must match your CSV header exactly (after trimming)
        option.value = topic.topic_name;
        option.text = `${topic.topic_name} - ${topic.short_description}`;
        topicDropdown.add(option);
      });
    })
    .catch(error => {
      console.error("[loadTopics] Error loading topics:", error);
      alert("Error loading topics. Check if 'quizzes/topics.csv' exists and is properly formatted.");
    });
}

/* ------------------------------
   On Topic Change: Load Subtopics
------------------------------ */
topicDropdown.addEventListener("change", () => {
  const selectedTopic = topicDropdown.value;
  console.log(`[topicDropdown.change] Selected topic: ${selectedTopic}`);

  // Reset subtopic dropdown
  subtopicDropdown.innerHTML = '<option value="">Select Subtopic</option>';
  subtopicDropdown.disabled = true;
  startQuizButton.disabled = true;

  if (selectedTopic) {
    console.log("[topicDropdown.change] Fetching quizzes/subtopics.csv...");
    fetch('quizzes/subtopics.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(csvData => {
        console.log("[topicDropdown.change] Parsing subtopics CSV data");
        const allSubtopics = parseCSV(csvData);

        // Filter subtopics for the selected topic
        const subtopics = allSubtopics.filter(s => s.topic_name === selectedTopic);
        console.log(`[topicDropdown.change] Found ${subtopics.length} subtopics for topic: ${selectedTopic}`);

        // Populate the subtopic dropdown
        subtopics.forEach(subtopic => {
          const option = document.createElement("option");
          option.value = subtopic.subtopic_name;
          option.text = `${subtopic.subtopic_name} - ${subtopic.short_description}`;
          subtopicDropdown.add(option);
        });

        // Check if there's a topic-level quiz
        const topicLevelQuizPath = `quizzes/${selectedTopic}/${selectedTopic}.csv`;
        fetch(topicLevelQuizPath)
          .then(response => {
            if (response.ok) {
              console.log("[topicDropdown.change] Found a topic-level quiz file.");
              const option = document.createElement("option");
              // Empty value indicates topic-level quiz
              option.value = "";
              option.text = "Start Quiz (Topic Level)";
              subtopicDropdown.add(option);
            } else {
              console.log("[topicDropdown.change] No topic-level quiz found (non-200 response).");
            }
          })
          .catch(err => {
            console.error("[topicDropdown.change] Error checking topic-level quiz:", err);
          });

        subtopicDropdown.disabled = false;
      })
      .catch(error => {
        console.error("[topicDropdown.change] Error loading subtopics:", error);
        alert("Error loading subtopics. Check if 'quizzes/subtopics.csv' exists and is properly formatted.");
      });
  }
});

/* ------------------------------
   On Subtopic Change
------------------------------ */
subtopicDropdown.addEventListener("change", () => {
  console.log(`[subtopicDropdown.change] Selected subtopic: ${subtopicDropdown.value}`);
  // Enable "Start Quiz" as long as there's some value
  startQuizButton.disabled = (subtopicDropdown.value === null);
});

/* ------------------------------
   Start Quiz
------------------------------ */
startQuizButton.addEventListener("click", () => {
  const selectedTopic = topicDropdown.value;
  const selectedSubtopic = subtopicDropdown.value;
  console.log(`[startQuizButton.click] Topic: ${selectedTopic}, Subtopic: ${selectedSubtopic}`);

  let csvFilePath = "";
  if (selectedSubtopic === "") {
    // Topic-level quiz
    csvFilePath = `quizzes/${selectedTopic}/${selectedTopic}.csv`;
  } else {
    // Subtopic-level quiz
    csvFilePath = `quizzes/${selectedTopic}/${selectedSubtopic}.csv`;
  }

  console.log(`[startQuizButton.click] Using CSV file path: ${csvFilePath}`);

  // Reset quiz data
  currentQuizData = [];
  currentQuestionIndex = 0;
  score = 0;
  // Reset the userAnswers array
  userAnswers = [];

  loadQuizData(csvFilePath);
});

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
  console.log(`[displayQuestion] Current index: ${currentQuestionIndex}`);
  if (currentQuizData.length === 0) {
    questionArea.textContent = "Error: No quiz data found.";
    nextQuestionButton.disabled = true;
    return;
  }
  if (currentQuestionIndex >= currentQuizData.length) {
    console.warn("[displayQuestion] Attempted to display a question beyond available range.");
    return;
  }

  const questionData = currentQuizData[currentQuestionIndex];
  console.log("[displayQuestion] Question data:", questionData);

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
  console.log("[nextQuestionButton.click] Next Question clicked");
  const selectedAnswers = Array
    .from(document.querySelectorAll('input[name="answer"]:checked'))
    .map(input => parseInt(input.value));

  console.log("[nextQuestionButton.click] Selected answers:", selectedAnswers);

  // Store user answers for this question
  userAnswers[currentQuestionIndex] = selectedAnswers;

  // Check if this question is not answered yet
  if (!currentQuizData[currentQuestionIndex].answered) {
    checkAnswer(selectedAnswers);
    currentQuizData[currentQuestionIndex].answered = true;
  }

  currentQuestionIndex++;
  console.log(`[nextQuestionButton.click] Moving to question index: ${currentQuestionIndex}`);

  if (currentQuestionIndex < currentQuizData.length) {
    displayQuestion();
  } else {
    console.log("[nextQuestionButton.click] No more questions, showing Submit button");
    nextQuestionButton.style.display = "none";
    submitQuizButton.style.display = "inline-block";
  }
});

/* ------------------------------
   Submit Quiz
------------------------------ */
submitQuizButton.addEventListener("click", () => {
  console.log("[submitQuizButton.click] Submit Quiz clicked");
  quizArea.style.display = "none";
  resultsArea.style.display = "block";

  const finalScore = Math.round(score * 100) / 100;
  scoreDisplay.textContent = `You got ${finalScore} out of ${currentQuizData.length} questions (based on partial credit).`;
  console.log(`[submitQuizButton.click] Final score: ${finalScore}`);

  // Make the "Show Answers" button visible
  showAnswersButton.style.display = "inline-block";
});

/* ------------------------------
   Check Answer
------------------------------ */
function checkAnswer(selectedAnswers) {
  const questionData = currentQuizData[currentQuestionIndex];
  console.log("[checkAnswer] Checking answers for question index:", currentQuestionIndex);
  console.log("[checkAnswer] Checking correct answers:", questionData.correct_answers);

  // Clean up the 'correct_answers' string if needed
  const cleanCorrectAnswers = questionData.correct_answers
    .replace(/"/g, "")
    .replace(/\r$/, "")
    .trim();

  const correctAnswers = cleanCorrectAnswers
    .split(';')
    .filter(v => v !== "")
    .map(v => parseInt(v, 10));

  console.log("[checkAnswer] correctAnswers:", correctAnswers);

  // If no correct answers, do nothing
  if (!correctAnswers || correctAnswers.length === 0) {
    console.log("[checkAnswer] No correct answers found for this question");
    return;
  }

  // PARTIAL CREDIT: each correct answer = fraction of 1 point
  let correctCount = 0;
  selectedAnswers.forEach(ans => {
    if (correctAnswers.includes(ans)) {
      correctCount++;
    }
  });

  const questionScore = correctCount / correctAnswers.length;
  score += questionScore;
  console.log(`[checkAnswer] Question score: ${questionScore} | Total score: ${score}`);
}

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

/* ------------------------------
   Restart Quiz
------------------------------ */
restartButton.addEventListener("click", () => {
  console.log("[restartButton.click] Restarting the quiz");
  // Show quiz selection, hide quiz area & results
  quizSelection.style.display = "block";
  quizArea.style.display = "none";
  resultsArea.style.display = "none";
  correctAnswersSection.style.display = "none";

  // Reset selection controls
  topicDropdown.value = "";
  subtopicDropdown.innerHTML = '<option value="">Select Subtopic</option>';
  subtopicDropdown.disabled = true;
  startQuizButton.disabled = true;

  // Reset quiz data
  currentQuizData = [];
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];

  // Hide "Show Answers" button just in case
  showAnswersButton.style.display = "none";
});
