// Retrieve the topic from the URL
const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');

// Subtopics dictionary
const subtopics = {
  "Quantum": ["Quantum", "QRNG", "QKD"],
  "Threats": ["Threats", "Discovery", "Blockchain", "Harvest now decrypt later", "Software Supply Chain", "Digital Signature"],
  "QRA": ["Algorithms", "Certificates", "ML-KEM", "ML-DSA", "SLH-DSA"],
  "Protocols": ["Protocols", "SSH", "TLS", "IPSEC", "SMIME", "PKI"],
  "Standards": ["Standards"],
  "Countries": ["Roadmap", "US", "Europe", "Canada", "Australia", "Singapore", "Germany", "France", "UK", "Netherlands", "China", "Korea"],
  "Industries": ["Telecom", "Automotive", "Banking", "Government", "Enterprises", "Healthcare"],
  "Quizz": ["Quizz"],
  "References": ["References"],
  "Experts": ["Experts"],
};

// Validate topic parameter
if (!topic || !subtopics[topic]) {
  console.error('Invalid or missing topic parameter.');
  alert('The selected topic is not valid. Redirecting to the main page.');
  window.location.href = '/index.html';
}

// Debug: Log the current topic
console.log('Current topic:', topic);

// Filter subtopics to exclude any occurrences of the main topic name
 // const filteredSubtopics = subtopics[topic].filter(
 // subtopic => subtopic.trim().toLowerCase() !== topic.trim().toLowerCase()
 // );

 const filteredSubtopics = subtopics[topic];

// Debug: Log the filtered subtopics
console.log('Filtered subtopics:', filteredSubtopics);

// Update subtopic title
const subtopicTitle = document.getElementById('subtopic-title');
subtopicTitle.textContent = topic;

// Clear any previous content in the grid
const subtopicGrid = document.getElementById('subtopic-grid-container');
subtopicGrid.innerHTML = ''; // Clear existing grid items to prevent duplication

// Populate subtopics grid
filteredSubtopics.forEach((subtopic, index) => {
  // Debug: Log each subtopic being rendered
  console.log(`Rendering subtopic [${index}]:`, subtopic);

  // Create subtopic card
  const subtopicItem = document.createElement('div');
  subtopicItem.className = 'subtopic-card';

  // Create logo image
  const logo = document.createElement('img');
  const logoPath = `/assets/${subtopic.toLowerCase().replace(/\s+/g, '-')}-dalle.webp`;
  logo.src = logoPath;
  logo.alt = `${subtopic} logo`;

  // Handle missing images
  logo.onerror = () => {
    console.warn(`Logo not found: ${logoPath}`);
    logo.src = '/assets/default-dalle.webp';
  };

  // Create subtopic text
  const text = document.createElement('span');
  text.textContent = subtopic;

  // Append elements to subtopic card
  subtopicItem.appendChild(logo);
  subtopicItem.appendChild(text);

  // Add click event to navigate to subtopic page
  subtopicItem.addEventListener('click', () => {
    window.location.href = `/sections/${topic}/${subtopic}/index.html`;
  });

  // Append subtopic card to grid
  subtopicGrid.appendChild(subtopicItem);
});

// Configure Quizz button
// const quizzLogo = document.getElementById('quizz-logo');
// if (quizzLogo) {
// quizzLogo.addEventListener('click', () => {
//  window.location.href = `./sections/Quizz/quiz.html?topic=${encodeURIComponent(topic)}&subtopic=all`;
// });
// }

// Configure Quizz button
const quizzButton = document.getElementById('start-quiz');
if (quizzButton) {
    quizzButton.addEventListener('click', () => {
        // Construct the URL to the quiz page, passing topic and subtopic parameters
        const quizUrl = `./sections/Quizz/quiz.html?topic=${encodeURIComponent(topic)}&subtopic=all`;
        window.location.href = quizUrl;
    });
}


// Configure Back button
const backButton = document.getElementById('back-to-main');
if (backButton) {
  backButton.addEventListener('click', () => {
    window.location.href = '/index.html';
  });
}
