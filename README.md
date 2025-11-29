# PQCToday - Post-Quantum Cryptography Education

[![License: CC0](https://img.shields.io/badge/License-CC0-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/)
[![Live Site](https://img.shields.io/badge/Live-pqctoday.github.io%2Froot-blue)](https://pqctoday.github.io/root/)

An educational website about post-quantum cryptography, designed to help people understand and prepare for the quantum computing era.

## 🌐 Live Site

Visit the live site at: **https://pqctoday.github.io/root/**

## 📖 About

PQCToday provides accessible information about post-quantum cryptography (PQC), covering:
- Quantum computing threats to current cryptography
- Post-quantum algorithms (ML-KEM, ML-DSA, SLH-DSA)
- Cryptographic protocols (TLS, SSH, IPsec, S/MIME, PKI)
- Standards and guidelines from NIST and other organizations
- Country-specific PQC roadmaps and adoption strategies
- Industry-specific considerations (telecom, automotive, banking, government, healthcare)

## 🚀 Quick Start

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pqctoday/root.git
   cd root
   ```

2. **Start a local server:**
   ```bash
   python3 -m http.server 8080
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8080/index.html`

### Project Structure

```
/
├── assets/              # Images and icons for topics
├── common/              # Shared JavaScript utilities
│   └── csv-table.js    # CSV table rendering
├── data/                # Data files (CSV references)
├── sections/            # Content sections for each topic
├── common.css           # Shared styles
├── data.js              # Topic configuration
├── index.html           # Main landing page
├── script.js            # Main page logic
├── style.css            # Index page styles
├── subtopics.html       # Subtopics page
├── subtopics.js         # Subtopics page logic
└── subtopics.css        # Subtopics page styles
```

## 🛠️ Development

### Adding a New Topic

1. Add the topic to `data.js`:
   ```javascript
   const subtopics = {
     "NewTopic": ["Subtopic1", "Subtopic2"],
     // ...
   };
   ```

2. Create topic icon in `assets/`:
   - File: `newtopic-dalle.webp`
   - Size: 80x80px recommended

3. Create section directory:
   ```
   sections/NewTopic/Subtopic1/index.html
   ```

### Code Style

- **Indentation:** 2 spaces
- **Line endings:** LF (Unix-style)
- **Charset:** UTF-8
- See `.editorconfig` for full details

### Testing

Before committing:
1. Test locally with `python3 -m http.server 8080`
2. Verify all topic cards display correctly
3. Test navigation between pages
4. Check browser console for errors

## 📝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test locally
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📚 Resources

- **NIST PQC Standards:** https://csrc.nist.gov/projects/post-quantum-cryptography
- **References:** See `data/references.csv` for curated list of PQC resources
- **NotebookLM Data:** See `data/notebookllm.csv` for additional references

## 🏗️ Technical Details

### CSS Architecture

- `common.css` - Shared styles (header, footer, cards, grid)
- `style.css` - Index page specific styles
- `subtopics.css` - Subtopics page specific styles

### JavaScript Architecture

- `data.js` - Centralized topic/subtopic configuration
- `script.js` - Main page logic (topic grid population)
- `subtopics.js` - Subtopics page logic (dynamic content loading)
- `common/csv-table.js` - Utility for rendering CSV data as tables

### GitHub Pages Deployment

The site is deployed to GitHub Pages under the `/root/` subdirectory. All asset and navigation paths include the `/root/` prefix to work correctly in this environment.

Cache-busting version parameters (`?v=2`) are used on JavaScript files to ensure browsers load the latest versions after deployments.

## 📄 License

This work is licensed under [Creative Commons Zero (CC0) 1.0 Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/).

You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.

## 🙏 Acknowledgments

- NIST for post-quantum cryptography standardization
- Various government agencies for PQC guidelines and roadmaps
- The open-source community for tools and resources

---

**Last Updated:** November 2024
