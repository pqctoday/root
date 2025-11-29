# Contributing to PQCToday

Thank you for your interest in contributing to PQCToday! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- Python 3 (for local development server)
- Git
- A text editor (VS Code, Sublime Text, etc.)

### Local Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/root.git
   cd root
   ```

2. **Start local server:**
   ```bash
   python3 -m http.server 8080
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8080/index.html`

## 📝 How to Contribute

### Reporting Issues

- Use GitHub Issues to report bugs or suggest features
- Provide clear description and steps to reproduce (for bugs)
- Include screenshots if relevant

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines below

3. **Test locally** - verify everything works

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** on GitHub

## 🎨 Code Style Guidelines

### HTML
- Use 2 spaces for indentation
- Use semantic HTML5 elements
- Include `alt` attributes for images
- Keep files under 500 lines when possible

### CSS
- Use 2 spaces for indentation
- Follow BEM naming convention where applicable
- Group related properties together
- Add comments for complex selectors

### JavaScript
- Use 2 spaces for indentation
- Use `const` and `let`, avoid `var`
- Add JSDoc comments for functions
- Use descriptive variable names
- Keep functions focused and small

### Example JavaScript Function
```javascript
/**
 * Populates the main topics grid with topic cards
 * @function populateMainTopics
 * @returns {void}
 */
function populateMainTopics() {
  mainTopicGrid.innerHTML = '';
  Object.keys(subtopics).forEach(topic => {
    // Create and append topic card
    const topicItem = createTopicCard(topic);
    mainTopicGrid.appendChild(topicItem);
  });
}
```

## 📂 Adding New Content

### Adding a New Topic

1. **Update `data.js`:**
   ```javascript
   const subtopics = {
     "YourTopic": ["Subtopic1", "Subtopic2", "Subtopic3"],
     // ...
   };
   ```

2. **Add topic icon:**
   - Create `assets/yourtopic-dalle.webp`
   - Recommended size: 80x80px
   - Use consistent style with existing icons

3. **Create section structure:**
   ```
   sections/YourTopic/
   ├── Subtopic1/
   │   └── index.html
   ├── Subtopic2/
   │   └── index.html
   └── Subtopic3/
       └── index.html
   ```

4. **Section HTML template:**
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>Subtopic Name - PQCToday</title>
     <link rel="stylesheet" href="/root/common.css">
   </head>
   <body>
     <!-- Your content here -->
     <script src="/root/common/csv-table.js"></script>
   </body>
   </html>
   ```

### Adding References

Add new references to `data/references.csv`:
```csv
title,date,url,author,country,category,reference,type
Your Reference Title,Month Year,https://example.com,Author Name,Country,Category,Reference ID,PDF
```

## 🧪 Testing

Before submitting a PR, please test:

1. **Visual Testing:**
   - All pages load without errors
   - Images display correctly
   - Navigation works properly
   - Responsive design works on mobile/tablet/desktop

2. **Browser Testing:**
   - Test in Chrome, Firefox, Safari
   - Check browser console for errors
   - Verify no 404 errors for assets

3. **Link Testing:**
   - All internal links work
   - External links open in new tabs
   - No broken links

## 🚢 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Important Notes:
- All paths must include `/root/` prefix for GitHub Pages
- JavaScript files use cache-busting (`?v=X`) to force browser updates
- Allow 30-60 seconds for GitHub Pages to rebuild after push

## 📋 Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows style guidelines
- [ ] All files use LF line endings (not CRLF)
- [ ] No console.log statements left in code
- [ ] Tested locally and works correctly
- [ ] No new warnings or errors in browser console
- [ ] Images are optimized (WebP format preferred)
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains what and why

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## 📞 Questions?

If you have questions:
- Open a GitHub Issue
- Check existing documentation
- Review similar PRs for examples

## 📄 License

By contributing, you agree that your contributions will be licensed under CC0 1.0 Universal.

---

Thank you for contributing to PQCToday! 🎉
