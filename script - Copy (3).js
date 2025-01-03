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
  "Quizz": ["General", "Threats", "Protocols", "Standardization Bodies", "Countries", "Industries"],
  "Threats": ["General", "Discovery", "Harvest now decrypt later", "Software Supply Chain", "Non repudiation"],
  "Protocols": ["General", "SSH", "TLS", "IPSEC", "SMIME", "PKI"],
  "Standardization Bodies": ["General", "CC", "CISA", "ETSI", "Global Platform", "GSMA", "OASIS", "TCG"],
  "Countries": ["General", "US", "Europe", "Canada", "Australia", "Singapore", "Germany", "France"],
  "Industries": ["General", "Telecom", "Automotive", "Banking", "Government", "Enterprises"],
  "Post Quantum Resistant Algorithms": ["General", "Certificates", "ML-KEM", "ML-DSA", "SLH-DSA"],
  "Quantum Technology": ["General", "QRNG", "QKD"],
};

function updateSubtopics(topic) {
  subtopicTrack.innerHTML = "";
  if (subtopics[topic]) {
    subtopics[topic].forEach(subtopic => {
      const subtopicItem = document.createElement('div');
      subtopicItem.className = 'carousel-item';
      subtopicItem.textContent = subtopic;

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
