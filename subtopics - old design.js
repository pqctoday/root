// Retrieve the topic from the URL
const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');

// Subtopics dictionary (shared or imported)
const subtopics = {
  "Quantum": ["Quantum", "QRNG", "QKD"],
  "Threats": ["Threats", "Discovery", "Blockchain", "Harvest now decrypt later", "Software Supply Chain", "Digital Signature"],
  "QRA": ["Algorithms", "Certificates", "ML-KEM", "ML-DSA", "SLH-DSA"],
  "Protocols": ["Protocols", "SSH", "TLS", "IPSEC", "SMIME", "PKI"],
  "Standards": ["Standards"],
  "Countries": ["Countries", "Roadmap","US", "Europe", "Canada", "Australia", "Singapore", "Germany", "France", "UK", "Netherlands","China", "Korea"],
  "Industries": ["Industries", "Telecom", "Automotive", "Banking", "Government", "Enterprises", "Healthcare"],
  "Quizz": ["Quizz"],
  "References": ["References"],
  "Experts": ["Experts"],
};

// Populate the subtopics grid
const subtopicTitle = document.getElementById('subtopic-title');
const subtopicGrid = document.getElementById('subtopic-grid-container');

subtopicTitle.textContent = topic;

if (subtopics[topic]) {
  subtopics[topic].forEach(subtopic => {
    const subtopicItem = document.createElement('div');
    subtopicItem.className = 'grid-item';

    const logo = document.createElement('img');
    const logoPath = `/assets/${subtopic.toLowerCase().replace(/\s+/g, '-')}-dalle.webp`;
    logo.src = logoPath;
    logo.alt = `${subtopic} logo`;

    logo.onerror = () => {
      console.warn(`Logo not found: ${logoPath}`);
      logo.src = '/assets/default-dalle.webp';
    };

    const text = document.createElement('span');
    text.textContent = subtopic;

    subtopicItem.appendChild(logo);
    subtopicItem.appendChild(text);

   // Correct logic to navigate to the subtopic page
   subtopicItem.addEventListener('click', () => {
    window.location.href = `/sections/${topic}/${subtopic}/index.html`;
  });
  
    subtopicGrid.appendChild(subtopicItem);
  });
}

// Configure Quizz logo link
const quizzLogo = document.getElementById('quizz-logo');
quizzLogo.addEventListener('click', () => {
  window.location.href = `./sections/Quizz/quiz.html?topic=${encodeURIComponent(topic)}&subtopic=all`; // Redirect to the Quizz page for the entire topic
});

// Back button event listener
const backButton = document.getElementById('back-to-main');
backButton.addEventListener('click', () => {
  window.location.href = '/index.html'; // Adjust to your main topics page
});
