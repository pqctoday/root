// Function to load SVG into the container
// Function to load SVG into the container
function loadSVG(url, container) {
  fetch(url)
    .then(response => response.text())
    .then(svgData => {
      container.innerHTML = svgData;
      initAnimation(); // Initialize the animation after SVG is loaded
    });
}

// Load the SVG
const container = document.getElementById("animation-container");
loadSVG("tls-handshake.svg", container);

function initAnimation() {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.inOut"
      }
    });
  
    // --- Client Hello ---
    tl.addLabel("clientHello")
      .fromTo("#clientHello", { x: 60, autoAlpha: 0 }, { duration: 1, x: "+=200", autoAlpha: 1 })
      .to("#clientHello", { duration: 1, x: "+=200", autoAlpha: 0 }, "+=1")
  
    // --- Server Hello ---
      .addLabel("serverHello")
      .fromTo("#serverHello", { x: 680, autoAlpha: 0 }, { duration: 1, x: "-=200", autoAlpha: 1 })
      .to("#serverHello", { duration: 1, x: "-=200", autoAlpha: 0 }, "+=1")
  
    // --- Server Certificate ---
      .addLabel("serverCertificate")
      .fromTo("#serverCertificate", { x: 680, autoAlpha: 0 }, { duration: 1, x: "-=200", autoAlpha: 1 })
      .to("#serverCertificate", { duration: 1, x: "-=200", autoAlpha: 0 }, "+=1")
  
    // --- Key Exchange (Simplified Example) ---
      .addLabel("keyExchange")
      .fromTo("#clientKey", { x: 60, autoAlpha: 0 }, { duration: 1, x: "+=200", autoAlpha: 1 })
      .to("#clientKey", { duration: 1, x: "+=200", autoAlpha: 0 }, "+=0.5")
      .fromTo("#serverKey", { x: 680, autoAlpha: 0 }, { duration: 1, x: "-=200", autoAlpha: 1 }, "keyExchange+=0.5")
      .to("#serverKey", { duration: 1, x: "-=200", autoAlpha: 0 }, "+=0.5")
  
    // --- Encryption (Simplified Example) ---
      .addLabel("encryption")
      .to("#padlock", { duration: 0.5, scale: 1.2, fill: "#FFD600", repeat: 3, yoyo: true });
  }