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
    // Updated selectors for subtopic arrows
    const subtopicPrevButton = document.querySelectorAll('.subtopic-carousel .subtopic-prev')[0];
    const subtopicNextButton = document.querySelectorAll('.subtopic-carousel .subtopic-next')[0];
    const navigateButton = document.getElementById('navigate-button');

    let subtopicIndex = 0;
    let selectedTopic = "";
    let selectedSubtopic = "";

    // Dictionary updated to match "Certificates Formats" key
    const subtopics = {
      "Quizz": ["Threats", "Protocols", "Post Quantum Resistant Algorithms", "Quantum Cryptography", "Certificates Formats"],
      "Threats": ["Harvest now decrypt later", "Software Supply Chain", "Non repudiation"],
      "Protocols": ["SSH", "TLS", "IPSEC"],
      "Standardization Bodies": ["NIST", "IETF", "NSA", "CISA", "BSI", "ANSSI", "GSMA"],
      "Countries": ["US", "Europe", "Canada", "Australia", "Singapore", "Germany"],
      "Industries": ["Telecom", "Automotive", "Banking", "Government", "Enterprises"],
      "Post Quantum Resistant Algorithms": ["ML-KEM", "ML-DSA", "SLH-DSA"],
      "Quantum Cryptography": ["QRNG", "QKD"],
      "Certificates Formats": ["Pure", "Hybrid", "Composite"],
      // "PQC Lab": ["OQS", "EJBCA", "OpenSSL", "OpenSSH", "OpenVPN", "OpenSwan", "StrongSwan"] // Example only
    };

    function updateSubtopics(topic) {
      subtopicTrack.innerHTML = "";
      if (subtopics[topic]) {
        subtopics[topic].forEach(subtopic => {
          const subtopicItem = document.createElement('div');
          subtopicItem.className = 'carousel-item';
          subtopicItem.textContent = subtopic;
          subtopicItem.addEventListener('click', () => {
            selectedSubtopic = subtopic;
            navigateButton.textContent = `Go to ${selectedTopic} / ${selectedSubtopic}`;
            navigateButton.style.display = 'block';
          });
          subtopicTrack.appendChild(subtopicItem);
        });
      }
    }

    function updateSubtopicCarousel() {
      const width = subtopicTrack.children[0]?.offsetWidth || 0;
      subtopicTrack.parentElement.scrollTo({
        left: subtopicIndex * width,
        behavior: 'smooth',
      });
    }

    subtopicPrevButton.addEventListener('click', () => {
      if (subtopicIndex > 0) {
        subtopicIndex--;
        updateSubtopicCarousel();
      }
    });

    subtopicNextButton.addEventListener('click', () => {
      if (subtopicIndex < subtopicTrack.children.length - 1) {
        subtopicIndex++;
        updateSubtopicCarousel();
      }
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        selectedTopic = item.getAttribute('data-topic');
        // Reset the subtopic index whenever a new topic is selected
        subtopicIndex = 0;

        // Show the subtopic carousel
        subtopicCarousel.classList.add('active');
        updateSubtopics(selectedTopic);
        updateSubtopicCarousel();

        // Hide the navigate button until a subtopic is clicked
        navigateButton.style.display = 'none';
      });
    });

    // NAVIGATE BUTTON
    navigateButton.addEventListener('click', () => {
      if (selectedTopic && selectedSubtopic) {
        const path = `/sections/${selectedTopic}/${selectedSubtopic}/index.html`;
        window.location.href = path;
      }
    });

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
        document.getElementById('summary-title').textContent = topic;
        document.getElementById('summary-content').textContent = summaries[topic];
        document.getElementById('main-topic-summary').style.display = 'block';
      });
    });