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
  loadTopics();
};

/* ------------------------------
   Function to Load Topics
------------------------------ */
function loadTopics() {
  fetch('quizzes/topics.csv')
    .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! ${response.status}`))
    .then(csvData => {
      const topics = parseCSV(csvData);
      topics.forEach(topic => {
        const option = document.createElement("option");
        option.value = topic.topic_name;
        option.text = `${topic.topic_name} - ${topic.short_description}`;
        topicDropdown.add(option);
      });
    })
    .catch(error => {
      alert("Error loading topics. Check if 'quizzes/topics.csv' exists.");
      console.error(error);
    });
}

/* ------------------------------
   On Topic Change: Load Subtopics
------------------------------ */
topicDropdown.addEventListener("change", () => {
  const selectedTopic = topicDropdown.value;
  subtopicDropdown.innerHTML = '<option value="">Select Subtopic</option>';
  subtopicDropdown.disabled = true;
  startQuizButton.disabled = true;

  if (selectedTopic) {
    fetch('quizzes/subtopics.csv')
      .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! ${response.status}`))
      .then(csvData => {
        const allSubtopics = parseCSV(csvData).filter(s => s.topic_name === selectedTopic);
        allSubtopics.forEach(subtopic => {
          const option = document.createElement("option");
          option.value = subtopic.subtopic_name;
          option.text = `${subtopic.subtopic_name} - ${subtopic.short_description}`;
          subtopicDropdown.add(option);
        });
        subtopicDropdown.disabled = false;
      })
      .catch(error => {
        alert("Error loading subtopics.");
        console.error(error);
      });
  }
});

/* ------------------------------
   On Subtopic Change
------------------------------ */
subtopicDropdown.addEventListener("change", () => {
  startQuizButton.disabled = !subtopicDropdown.value;
});

/* ------------------------------
   Start Quiz
------------------------------ */
startQuizButton.addEventListener("click", () => {
  const selectedTopic = topicDropdown.value;
  const selectedSubtopic = subtopicDropdown.value;

  if (selectedSubtopic === "") {
    aggregateSubtopicQuestions(selectedTopic);
  } else {
    loadQuizData(`quizzes/${selectedTopic}/${selectedSubtopic}.csv`);
  }
});

/* ------------------------------
   Aggregate Subtopic Questions
------------------------------ */
function aggregateSubtopicQuestions(topicName) {
  fetch('quizzes/subtopics.csv')
    .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! ${response.status}`))
    .then(csvData => {
      const subtopics = parseCSV(csvData).filter(s => s.topic_name === topicName);
      const questionPromises = subtopics.map(subtopic => {
        const path = `quizzes/${topicName}/${subtopic.subtopic_name}.csv`;
        return fetch(path)
          .then(response => response.ok ? response.text() : "")
          .then(csv => (csv ? parseCSV(csv) : []));
      });

      Promise.all(questionPromises).then(allQuestions => {
        const aggregatedQuestions = allQuestions.flat();
        currentQuizData = pickRandomQuestions(aggregatedQuestions, 5);
        startQuiz();
      });
    })
    .catch(error => {
      alert("Error aggregating questions.");
      console.error(error);
    });
}

/* ------------------------------
   Pick Random Questions
------------------------------ */
function pickRandomQuestions(questions, count) {
  return questions.sort(() => 0.5 - Math.random()).slice(0, count);
}

/* ------------------------------
   Load Quiz Data
------------------------------ */
function loadQuizData(csvFilePath) {
  fetch(csvFilePath)
    .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! ${response.status}`))
    .then(csvData => {
      currentQuizData = parseCSV(csvData);
      startQuiz();
    })
    .catch(error => {
      alert("Error loading quiz.");
      console.error(error);
    });
}

/* ------------------------------
   Start Quiz Helper
------------------------------ */
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  quizSelection.style.display = "none";
  quizArea.style.display = "block";
  displayQuestion();
}

/* ------------------------------
   Display Question
------------------------------ */
function displayQuestion() {
  const question = currentQuizData[currentQuestionIndex];
  questionArea.textContent = question.question;
  answerArea.innerHTML = "";

  for (let i = 1; i <= 4; i++) {
    if (question[`answer${i}`]) {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "answer";
      checkbox.value = i;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(question[`answer${i}`]));
      answerArea.appendChild(label);
      answerArea.appendChild(document.createElement("br"));
    }
  }

  nextQuestionButton.style.display = "inline-block";
  nextQuestionButton.disabled = false;
  submitQuizButton.style.display = "none";
}

/* ------------------------------
   Next Question
------------------------------ */
nextQuestionButton.addEventListener("click", () => {
  const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked'))
    .map(input => parseInt(input.value));
  userAnswers[currentQuestionIndex] = selectedAnswers;
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
  showAnswersButton.style.display = "inline-block";
});

/* ------------------------------
   Display Correct Answers
------------------------------ */
showAnswersButton.addEventListener("click", () => {
  correctAnswersSection.style.display = "block";
  correctAnswersList.innerHTML = "";

  currentQuizData.forEach((question, index) => {
    const questionElem = document.createElement("h3");
    questionElem.textContent = `Question ${index + 1}: ${question.question}`;
    correctAnswersList.appendChild(questionElem);

    for (let i = 1; i <= 4; i++) {
      if (question[`answer${i}`]) {
        const answerElem = document.createElement("p");
        answerElem.textContent = `${i}. ${question[`answer${i}`]}${
          question.correct_answers.includes(i.toString()) ? " (Correct)" : ""
        }`;
        correctAnswersList.appendChild(answerElem);
      }
    }
    correctAnswersList.appendChild(document.createElement("hr"));
  });
});

/* ------------------------------
   Parse CSV
------------------------------ */
function parseCSV(csvString) {
  const rows = csvString.trim().split('\n');
  const header = rows.shift().split(',').map(h => h.trim());

  return rows.map(row => {
    const values = row.split(',').map(v => v.trim());
    return Object.fromEntries(header.map((key, i) => [key, values[i] || ""]));
  });
}
