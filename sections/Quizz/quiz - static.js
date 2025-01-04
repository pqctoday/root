// Utility to parse URL parameters
function getUrlParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }
  
  // Retrieve the topic and subtopic from URL
  const params = getUrlParams();
  const topic = params.topic || 'General';
  const subtopic = params.subtopic || 'Overview';
  
  // Update quiz title and description dynamically
  document.getElementById('quiz-title').textContent = `${topic} - ${subtopic} Quiz`;
  document.getElementById('quiz-description').textContent = `This quiz is tailored to the topic "${topic}" and subtopic "${subtopic}". Good luck!`;
  
  // Placeholder for quiz content (You can replace this with dynamic loading logic)
  const quizContainer = document.getElementById('quiz-container');
  
  // Example Quiz Content
  const questions = {
    Quantum: {
      QRNG: [
        { question: 'What does QRNG stand for?', options: ['Quantum Random Number Generator', 'Quantum Relative Neuron Growth'], answer: 0 },
        { question: 'Why is QRNG important?', options: ['Improved security', 'Faster computation', 'Both'], answer: 2 },
      ],
      QKD: [
        { question: 'What is QKD used for?', options: ['Encrypting classical data', 'Quantum key distribution'], answer: 1 },
      ],
    },
  };
  
  const currentQuestions = questions[topic]?.[subtopic] || [];
  if (currentQuestions.length > 0) {
    let html = '<h3>Questions:</h3>';
    currentQuestions.forEach((q, idx) => {
      html += `
        <div>
          <p>${idx + 1}. ${q.question}</p>
          ${q.options
            .map(
              (option, optIdx) =>
                `<label><input type="radio" name="q${idx}" value="${optIdx}"> ${option}</label>`
            )
            .join('')}
        </div>`;
    });
    html += `<button onclick="submitQuiz()">Submit</button>`;
    quizContainer.innerHTML = html;
  } else {
    quizContainer.innerHTML = '<p>No questions available for this topic and subtopic.</p>';
  }
  
  // Handle quiz submission
  function submitQuiz() {
    let score = 0;
    currentQuestions.forEach((q, idx) => {
      const selectedOption = document.querySelector(`input[name="q${idx}"]:checked`);
      if (selectedOption && parseInt(selectedOption.value) === q.answer) {
        score++;
      }
    });
    quizContainer.innerHTML = `<h3>You scored ${score} out of ${currentQuestions.length}!</h3>`;
  }
  