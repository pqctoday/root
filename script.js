const mainTopicGrid = document.getElementById('main-topic-grid');
const subtopicGridContainer = document.getElementById('subtopic-grid-container');
const subtopicGrid = document.getElementById('subtopic-grid');
const subtopicTitle = document.getElementById('subtopic-title');

// Subtopics dictionary
const subtopics = {
  "Quizz": ["Quizz", "Threats", "Protocols", "Standardization Bodies", "Countries", "Industries"],
  "Threats": ["Threats", "Discovery", "Harvest now decrypt later", "Software Supply Chain Threat", "Digital Signature Threat"],
  "Protocols": ["Protocols", "SSH", "TLS", "IPSEC", "SMIME", "PKI"],
  "Standardization Bodies": ["Standardization Bodies"],
  "Countries": ["Countries", "US", "Europe", "Canada", "Australia", "Singapore", "Germany", "France"],
  "Industries": ["Industries", "Telecom", "Automotive", "Banking", "Government", "Enterprises"],
  "Post Quantum Resistant Algorithms": ["Algorithms", "Certificates", "ML-KEM", "ML-DSA", "SLH-DSA"],
  "Quantum Technology": ["Quantum", "QRNG", "QKD"],
};

// Populate main topics
function populateMainTopics() {
  mainTopicGrid.innerHTML = '';
  Object.keys(subtopics).forEach(topic => {
    const topicItem = document.createElement('div');
    topicItem.className = 'grid-item';

    const logo = document.createElement('img');
    logo.src = `/assets/${topic.toLowerCase().replace(/\s+/g, '-')}-dalle.webp`;
    logo.alt = `${topic} logo`;

    const text = document.createElement('span');
    text.textContent = topic;

    topicItem.appendChild(logo);
    topicItem.appendChild(text);

    // Event listener for topic click
    topicItem.addEventListener('click', () => {
      if (topic === 'Quizz') {
        window.location.href = '/sections/Quizz/index.html';
        return;
      }
      populateSubtopics(topic);
    });

    mainTopicGrid.appendChild(topicItem);
  });
}

// Populate subtopics
function populateSubtopics(topic) {
  subtopicTitle.textContent = topic;
  subtopicGridContainer.style.display = 'block';
  subtopicGrid.innerHTML = '';

  if (subtopics[topic]) {
    subtopics[topic].forEach(subtopic => {
      const subtopicItem = document.createElement('div');
      subtopicItem.className = 'grid-item';

      const logo = document.createElement('img');
      logo.src = `/assets/${subtopic.toLowerCase().replace(/\s+/g, '-')}-dalle.webp`;
      logo.alt = `${subtopic} logo`;

      const text = document.createElement('span');
      text.textContent = subtopic;

      subtopicItem.appendChild(logo);
      subtopicItem.appendChild(text);

      // Event listener for subtopic click
      subtopicItem.addEventListener('click', () => {
        window.location.href = `/sections/${topic}/${subtopic}/index.html`;
      });

      subtopicGrid.appendChild(subtopicItem);
    });
  }
}

// Initialize main topics on page load
populateMainTopics();
