/* ==========================
   QUIZ SCRIPT WITH LOGGING
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

let currentQuizData = [];
let currentQuestionIndex = 0;
let score = 0;

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
  subtopicDropdown.innerHTML = '<option value="">Select Subtopic or Start Quiz</option>';
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
              option.value = ""; // indicates topic-level quiz
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

      displayQuestion();
    })
    .catch(error => {
      console.error("[loadQuizData] Error loading or parsing CSV:", error);
      alert(error.message);
    });
}

/* ------------------------------
   Parse CSV
------------------------------ */
function parseCSV(csvString) {
  try {
    const rows = csvString.trim().split('\n');
    const header = rows.shift().split(',');

    console.log(`[parseCSV] CSV header: ${header.join(", ")}`);
    console.log(`[parseCSV] Number of data rows: ${rows.length}`);

    return rows.map((row, index) => {
      const values = row.split(',');
      const obj = {};
      header.forEach((key, i) => {
        obj[key] = values[i] ? values[i] : "";
      });
      console.log(`[parseCSV] Row #${index + 1}:`, obj);
      return obj;
    });
  } catch (e) {
    console.error("[parseCSV] Error:", e);
    alert("Error parsing CSV data. Ensure the file is formatted correctly.");
    return [];
  }
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
  scoreDisplay.textContent = `You got ${finalScore} out of ${currentQuizData.length} questions (partial credit possible).`;
  console.log(`[submitQuizButton.click] Final score: ${finalScore}`);
});

/* ------------------------------
   Check Answer
------------------------------ */
function checkAnswer(selectedAnswers) {
  const questionData = currentQuizData[currentQuestionIndex];
  console.log("[checkAnswer] Checking answers for question index:", currentQuestionIndex);
  console.log("[checkAnswer] Checking question data:", questionData);

  // "correct_answers" could be something like "1;3"
// First, remove any surrounding quotes and trim whitespace:

console.log("[checkAnswer] correctAnswers before cleaning:", questionData.correct_answers);

const cleanCorrectAnswers = questionData.correct_answers
  .replace(/"/g, "")   // remove all double quotes
  .replace(/\r$/, "")  // remove a trailing carriage return if present
  .trim();             // remove leading/trailing spaces
  
// Then split on ';' and parse:
const correctAnswers = cleanCorrectAnswers
  .split(';')
  .filter(v => v !== "")
  .map(v => parseInt(v, 10));

console.log("[checkAnswer] correctAnswers after cleaning:", correctAnswers);


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
   Restart Quiz
------------------------------ */
restartButton.addEventListener("click", () => {
  console.log("[restartButton.click] Restarting the quiz");
  // Show quiz selection, hide quiz area & results
  quizSelection.style.display = "block";
  quizArea.style.display = "none";
  resultsArea.style.display = "none";

  // Reset selection controls
  topicDropdown.value = "";
  subtopicDropdown.innerHTML = '<option value="">Select Subtopic</option>';
  subtopicDropdown.disabled = true;
  startQuizButton.disabled = true;

  // Reset quiz data
  currentQuizData = [];
  currentQuestionIndex = 0;
  score = 0;
});
