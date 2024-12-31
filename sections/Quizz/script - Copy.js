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

// Function to load topics from topics.csv
function loadTopics() {
    fetch('quizzes/topics.csv')
        .then(response => response.text())
        .then(csvData => {
            const topics = parseCSV(csvData); // Use the parseCSV function from before
            topics.forEach(topic => {
                const option = document.createElement("option");
                option.value = topic.topic_name;
                option.text = `${topic.topic_name} - ${topic.short_description}`;
                topicDropdown.add(option);
            });
        })
        .catch(error => console.error("Error loading topics:", error));
}

// Function to load subtopics from subtopics.csv when a topic is selected
topicDropdown.addEventListener("change", () => {
    const selectedTopic = topicDropdown.value;
    subtopicDropdown.innerHTML = '<option value="">Select Subtopic or Start Quiz</option>'; // Reset subtopic dropdown
    subtopicDropdown.disabled = true;
    startQuizButton.disabled = true;

    if (selectedTopic) {
        fetch('quizzes/subtopics.csv')
            .then(response => response.text())
            .then(csvData => {
                const allSubtopics = parseCSV(csvData);
                const subtopics = allSubtopics.filter(subtopic => subtopic.topic_name === selectedTopic);

                subtopics.forEach(subtopic => {
                    const option = document.createElement("option");
                    option.value = subtopic.data_file; // Use data_file path as value
                    option.text = `${subtopic.subtopic_name} - ${subtopic.short_description}`;
                    subtopicDropdown.add(option);
                });
                // Check if there's a topic-level quiz
                fetch(`quizzes/data/${selectedTopic}/${selectedTopic}.csv`)
                    .then(response => {
                        if (response.ok) {
                            // Topic-level quiz exists
                            const option = document.createElement("option");
                            option.value = `data/${selectedTopic}/${selectedTopic}.csv`;
                            option.text = "Start Quiz (Topic Level)";
                            subtopicDropdown.add(option);
                        }
                    })
                    .catch(error => console.error("Error checking for topic-level quiz:", error));

                subtopicDropdown.disabled = false;
            })
            .catch(error => console.error("Error loading subtopics:", error));
    }
});

// Enable Start Quiz button when a subtopic or topic-level quiz is selected
subtopicDropdown.addEventListener("change", () => {
    startQuizButton.disabled = !subtopicDropdown.value;
});

// Function to load and start the quiz (modified to use data_file path)
startQuizButton.addEventListener("click", () => {
    const selectedQuizDataFile = subtopicDropdown.value; // This is now the data_file path
    const selectedTopic = topicDropdown.value;

    if (selectedQuizDataFile) {
        if (selectedQuizDataFile === `data/${selectedTopic}/${selectedTopic}.csv`) {
            // It's a topic-level quiz
            loadQuizData(selectedQuizDataFile);
        } else {
            // It's a subtopic-level quiz
            loadQuizData(selectedQuizDataFile);
        }
    }
});

// Function to load quiz data from CSV (Corrected to call displayQuestion)
function loadQuizData(csvFilePath) {
    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvData => {
            currentQuizData = parseCSV(csvData);
            currentQuestionIndex = 0;
            score = 0;
            quizSelection.style.display = "none";
            quizArea.style.display = "block";
            resultsArea.style.display = "none";
            displayQuestion(); // Now correctly displays the first question
        })
        .catch(error => {
            console.error("Error loading or parsing CSV:", error);
            alert("Error loading quiz data. Please check the CSV file and path.");
        });
}

// Function to parse CSV data into an array of objects (no changes needed)
function parseCSV(csvString) {
    const rows = csvString.trim().split('\n');
    const header = rows.shift().split(',');
    return rows.map(row => {
        const values = row.split(',');
        const obj = {};
        header.forEach((key, index) => {
            obj[key] = values[index];
        });
        return obj;
    });
}


// Function to display the current question (no changes needed)
function displayQuestion() {
    const questionData = currentQuizData[currentQuestionIndex];
    questionArea.textContent = questionData.question;
    answerArea.innerHTML = "";

    // Create answer elements (checkboxes for multiple-choice)
    for (let i = 1; i <= 4; i++) { // Assuming a maximum of 4 answer options
        if (questionData[`answer${i}`]) {
            const answerLabel = document.createElement("label");
            const answerInput = document.createElement("input");
            answerInput.type = "checkbox";
            answerInput.name = "answer";
            answerInput.value = i;

            answerLabel.appendChild(answerInput);
            answerLabel.appendChild(document.createTextNode(questionData[`answer${i}`]));
            answerArea.appendChild(answerLabel);
        }
    }

    nextQuestionButton.disabled = false;
    submitQuizButton.style.display = "none";
}

// Event listener for the Next Question button (no changes needed)
nextQuestionButton.addEventListener("click", () => {
    const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked'))
        .map(input => parseInt(input.value));

    // Check answers and update score only if it's the first time answering the question
    if (!currentQuizData[currentQuestionIndex].answered) {
        checkAnswer(selectedAnswers);
        currentQuizData[currentQuestionIndex].answered = true; // Mark the question as answered
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizData.length) {
        displayQuestion();
    } else {
        nextQuestionButton.style.display = "none";
        submitQuizButton.style.display = "block";
    }
});

// Event listener for the Submit Quiz button (no changes needed)
submitQuizButton.addEventListener("click", () => {
    // Calculate and display the final score
    quizArea.style.display = "none";
    resultsArea.style.display = "block";
    scoreDisplay.textContent = `You got ${score} out of ${currentQuizData.length} questions right.`;
});

// Function to check the selected answers against correct answers (no changes needed)
function checkAnswer(selectedAnswers) {
    const questionData = currentQuizData[currentQuestionIndex];
    const correctAnswers = questionData.correct_answers.split(';').filter(val => val !== "").map(Number);

    if (correctAnswers.length === 0) { // No correct answers (e.g., open-ended questions)
        return; // No score is updated
    }

    if (areArraysEqual(selectedAnswers, correctAnswers)) {
        score++;
    }
}

// Helper function to compare arrays (no changes needed)
function areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    arr1.sort();
    arr2.sort();
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// Event listener for the Restart button (no changes needed)
restartButton.addEventListener("click", () => {
    quizSelection.style.display = "block";
    resultsArea.style.display = "none";
    topicDropdown.value = "";
    subtopicDropdown.innerHTML = '<option value="">Select Subtopic</option>';
    subtopicDropdown.disabled = true;
    startQuizButton.disabled = true;
});

// Load topics on page load
window.onload = () => {
    loadTopics();
};