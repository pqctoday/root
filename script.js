// Logo sizing
window.addEventListener('load', function () {
  const logoText = document.getElementById('logo-text');
  const logoImg = document.getElementById('logo-img');
  if (logoText && logoImg) {
    const logoTextHeight = logoText.offsetHeight;
    logoImg.style.height = (1.5 * logoTextHeight) + 'px';
  }
});

// DOM elements
const mainTopicGrid = document.getElementById('main-topic-grid');
const subtopicGridContainer = document.getElementById('subtopic-grid-container');
const subtopicGrid = document.getElementById('subtopic-grid');
const subtopicTitle = document.getElementById('subtopic-title');

// Subtopics dictionary
// Subtopics are now loaded from data.js

// Populate main topics
function populateMainTopics() {
  mainTopicGrid.innerHTML = '';
  Object.keys(subtopics).forEach(topic => {
    const topicItem = document.createElement('div');
    topicItem.className = 'grid-item';

    const logo = document.createElement('img');
    logo.src = `/root/assets/${topic.toLowerCase().replace(/\s+/g, '-')}-dalle.webp`;
    logo.alt = `${topic} logo`;

    const text = document.createElement('span');
    text.textContent = topic;

    topicItem.appendChild(logo);
    topicItem.appendChild(text);

    // Event listener for topic click
    topicItem.addEventListener('click', () => {
      if (topic === 'Quizz') {
        window.location.href = '/root/sections/Quizz/index.html';
        return;
      }
      if (topic === 'References') {
        window.location.href = '/root/sections/References/index.html';
        return;
      }
      if (topic === 'Experts') {
        window.location.href = '/root/sections/Experts/index.html';
        return;
      }
      if (topic === 'Standardization') {
        window.location.href = '/root/sections/Standardization/index.html';
        return;
      }
      populateSubtopics(topic);
    });

    mainTopicGrid.appendChild(topicItem);
  });
}

function populateSubtopics(topic) {
  window.location.href = `/root/subtopics.html?topic=${encodeURIComponent(topic)}`;
}


// Initialize main topics on page load
populateMainTopics();
