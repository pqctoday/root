// MAIN CAROUSEL
const carouselTrack = document.querySelector('.carousel-track');
const prevButton = document.querySelectorAll('.carousel-title .prev')[0];
const nextButton = document.querySelectorAll('.carousel-title .next')[0];
const items = Array.from(carouselTrack.children);

let currentIndex = 0;

function updateCarousel() {
  const width = items[0].offsetWidth;
  carouselTrack.style.transform = `translateX(-${currentIndex * width}px)`;
}

prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

nextButton.addEventListener('click', () => {
  if (currentIndex < items.length - 1) {
    currentIndex++;
    updateCarousel();
  }
});

// SUBTOPIC CAROUSEL
const subtopicCarousel = document.getElementById('subtopic-carousel');
const subtopicTrack = document.getElementById('subtopic-track');
const subtopicPrevButton = document.querySelector('.subtopic-carousel .subtopic-prev');
const subtopicNextButton = document.querySelector('.subtopic-carousel .subtopic-next');

let subtopicIndex = 0;

// Subtopics dictionary
const subtopics = {
  "Quizz": ["Quizz", "Threats", "Protocols", "Standardization Bodies", "Countries", "Industries"],
  "Threats": ["Threats", "Discovery", "Harvest now decrypt later", "Software Supply Chain Threat", "Digital Signature Threat"],
  "Protocols": ["Protocols", "SSH", "TLS", "IPSEC", "SMIME", "PKI"],
  "Standardization Bodies": ["Standardization bodies"],
  "Countries": ["Countries", "US", "Europe", "Canada", "Australia", "Singapore", "Germany", "France"],
  "Industries": ["Industries", "Telecom", "Automotive", "Banking", "Government", "Enterprises"],
  "Post Quantum Resistant Algorithms": ["Algorithms", "Certificates", "ML-KEM", "ML-DSA", "SLH-DSA"],
  "Quantum Technology": ["Quantum", "QRNG", "QKD"],
};

function updateSubtopics(topic) {
  subtopicTrack.innerHTML = "";
  if (subtopics[topic]) {
    subtopics[topic].forEach(subtopic => {
      const subtopicItem = document.createElement('div');
      subtopicItem.className = 'carousel-item';

      // Create a container for logo and text
      const logoContainer = document.createElement('div');
      logoContainer.className = 'subtopic-logo-container';

      // Add a placeholder logo for each subtopic
      const logo = document.createElement('img');
      logo.src = `/assets/${subtopic.toLowerCase().replace(/\s+/g, '-')}-dalle.webp`; // Replace with your logo path logic
      logo.alt = `${subtopic} logo`;
      logo.className = 'subtopic-logo';

      const text = document.createElement('span');
      text.textContent = subtopic;

      // Append the logo and text to the container
      logoContainer.appendChild(logo);
      subtopicItem.appendChild(logoContainer);
      subtopicItem.appendChild(text);

      // Navigate directly when a subtopic is clicked
      subtopicItem.addEventListener('click', () => {
        window.location.href = `/sections/${topic}/${subtopic}/index.html`;
      });

      subtopicTrack.appendChild(subtopicItem);
    });
  }
}

function updateSubtopicCarousel() {
  const itemWidth = subtopicTrack.children[0]?.offsetWidth || 0; // Get the width of a single subtopic item
  const visibleWidth = subtopicTrack.parentElement.offsetWidth; // Visible width of the carousel container
  const totalWidth = subtopicTrack.scrollWidth; // Total width of all subtopic items combined
  const maxIndex = Math.floor((totalWidth - visibleWidth) / itemWidth); // Calculate max scrollable index

  // Clamp the subtopic index between 0 and maxIndex
  subtopicIndex = Math.max(0, Math.min(subtopicIndex, maxIndex));

  // Scroll the track
  const scrollAmount = subtopicIndex * itemWidth;
  subtopicTrack.parentElement.scrollTo({
    left: scrollAmount,
    behavior: 'smooth',
  });

  // Enable or disable buttons based on the scroll position
  subtopicPrevButton.disabled = subtopicIndex === 0;
  subtopicNextButton.disabled = subtopicIndex === maxIndex;
}

// Handle previous button click
subtopicPrevButton.addEventListener('click', () => {
  subtopicIndex--;
  updateSubtopicCarousel();
});

// Handle next button click
subtopicNextButton.addEventListener('click', () => {
  subtopicIndex++;
  updateSubtopicCarousel();
});

// Initialize subtopic buttons' state
updateSubtopicCarousel();

// When clicking a main carousel item
items.forEach(item => {
  item.addEventListener('click', () => {
    const selectedTopic = item.getAttribute('data-topic');

    // If topic is "Quizz", navigate directly
    if (selectedTopic === 'Quizz') {
      window.location.href = '/sections/Quizz/index.html';
      return;
    }

    // Otherwise, show subtopic carousel
    subtopicCarousel.classList.add('active');
    subtopicIndex = 0;
    updateSubtopics(selectedTopic);
    updateSubtopicCarousel();
  });
});

// (Optional) Summaries if you still want to show them
const summaries = {
  "Quizz": "Test your knowledge with our Post Quantum Cryptography quizzes.",
  "Threats": "Learn about the potential threats posed by quantum computing to current cryptographic systems.",
  "Protocols": "Explore the protocols designed to secure communications in a post-quantum world.",
  "Standardization Bodies": "Discover the organizations working on standardizing post-quantum cryptographic algorithms.",
  "Countries": "See how different countries are preparing for the quantum future.",
  "Industries": "Find out how various industries are adapting to post-quantum cryptography.",
  "Post Quantum Resistant Algorithms": "Understand the algorithms that are resistant to quantum attacks.",
  "Quantum Cryptography": "Dive into the world of quantum cryptography and its applications.",
  "Certificates Formats": "Learn about the new certificate formats designed for post-quantum security.",
  "Quantum Technology": "Explore the latest advancements in quantum technology."
};

document.querySelectorAll('.carousel-item').forEach(item => {
  item.addEventListener('click', () => {
    const topic = item.getAttribute('data-topic');
    if (topic !== 'Quizz') {
      document.getElementById('summary-title').textContent = topic;
      document.getElementById('summary-content').textContent = summaries[topic] || '';
      document.getElementById('main-topic-summary').style.display = 'block';
    }
  });
});
