/**
 * Subtopics Page Logic
 * Dynamically loads and displays subtopics based on URL parameter
 */

// Retrieve the topic from the URL
const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');

// Subtopics dictionary
// Subtopics are now loaded from data.js

// Validate topic parameter
if (!topic || !subtopics[topic]) {
  console.error('Invalid or missing topic parameter.');
  alert('The selected topic is not valid. Redirecting to the main page.');
  window.location.href = '/root/index.html';
}


const filteredSubtopics = subtopics[topic];



// Update subtopic title
const subtopicTitle = document.getElementById('subtopic-title');
subtopicTitle.textContent = topic;

// Clear any previous content in the grid
const subtopicGrid = document.getElementById('subtopic-grid-container');
subtopicGrid.innerHTML = ''; // Clear existing grid items to prevent duplication

// Populate subtopics grid
filteredSubtopics.forEach((subtopic) => {

  // Create subtopic card as button for accessibility
  const subtopicItem = document.createElement('button');
  subtopicItem.className = 'subtopic-card';
  subtopicItem.setAttribute('type', 'button');
  subtopicItem.setAttribute('aria-label', `Learn about ${subtopic} in ${topic}`);

  // Create logo image
  const logo = document.createElement('img');
  const logoPath = `/root/assets/${subtopic.toLowerCase().replace(/\s+/g, '-')}-dalle.webp`;
  logo.src = logoPath;
  logo.alt = `${subtopic} - Learn about ${subtopic} in ${topic}`;

  // Handle missing images
  logo.onerror = () => {
    logo.src = '/root/assets/default-dalle.webp';
  };

  // Create text label
  const text = document.createElement('span');
  text.textContent = subtopic;

  // Append elements
  subtopicItem.appendChild(logo);
  subtopicItem.appendChild(text);

  // Add click event listener
  subtopicItem.addEventListener('click', () => {
    window.location.href = `/root/sections/${topic}/${subtopic}/index.html`;
  });

  // Add keyboard event listener
  subtopicItem.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = `/root/sections/${topic}/${subtopic}/index.html`;
    }
  });

  // Append subtopic card to grid
  subtopicGrid.appendChild(subtopicItem);
});



// Configure Quizz button
const quizzButton = document.getElementById('start-quiz');
if (quizzButton) {
  quizzButton.addEventListener('click', () => {
    // Construct the URL to the quiz page, passing topic and subtopic parameters
    const quizUrl = `/root/sections/Quizz/quiz.html?topic=${encodeURIComponent(topic)}&subtopic=all`;
    window.location.href = quizUrl;
  });
}


// Configure Back button
const backButton = document.getElementById('back-to-main');
if (backButton) {
  backButton.addEventListener('click', () => {
    window.location.href = '/root/index.html';
  });
}
