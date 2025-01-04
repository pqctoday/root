const mainTopicGrid = document.getElementById('main-topic-grid');
const subtopicGridContainer = document.getElementById('subtopic-grid-container');
const subtopicGrid = document.getElementById('subtopic-grid');
const subtopicTitle = document.getElementById('subtopic-title');

// Subtopics dictionary
const subtopics = {
  "Quantum": ["Quantum", "QRNG", "QKD"],
  "Threats": ["Threats", "Discovery", "Blockchain", "Harvest now decrypt later", "Software Supply Chain", "Digital Signature"],
  "QRA": ["Algorithms", "Certificates", "ML-KEM", "ML-DSA", "SLH-DSA"],
  "Protocols": ["Protocols", "SSH", "TLS", "IPSEC", "SMIME", "PKI"],
  "Standards": ["Standards"],
  "Countries": ["Countries", "US", "Europe", "Canada", "Australia", "Singapore", "Germany", "France","UK","Netherlands"],
  "Industries": ["Industries", "Telecom", "Automotive", "Banking", "Government", "Enterprises","Healthcare"],
  "Quizz": ["Quizz"],
  "References": ["References"],
  "Experts": ["Experts"],
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
      if (topic === 'References') {
        window.location.href = '/sections/References/index.html';
        return;
      }
      if (topic === 'Experts') {
        window.location.href = '/sections/Experts/index.html';
        return;
      }
      if (topic === 'Standardization') {
        window.location.href = '/sections/Standardization/index.html';
        return;
      }
      populateSubtopics(topic);
    });

    mainTopicGrid.appendChild(topicItem);
  });

  updateGridColumns(); // Update grid layout after populating
}

function populateSubtopics(topic) {
  window.location.href = `/subtopics.html?topic=${encodeURIComponent(topic)}`;
}


// Initialize main topics on page load
populateMainTopics();

// Add event listener to handle window resize
window.addEventListener('resize', updateGridColumns);

// Update grid layout on initial page load
window.addEventListener('DOMContentLoaded', updateGridColumns);
