document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("menuToggle");
  const navLinks = [...document.querySelectorAll(".nav-link")];

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
  toggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(opened));
    toggle.setAttribute("aria-label", opened ? "Close navigation" : "Open navigation");
    toggle.innerHTML = opened ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  navLinks.forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("click", event => {
    if (nav.classList.contains("open") && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape") { closeMenu(); closeModal(trailerModal); closeModal(imageModal); } });

  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => observer.observe(section));
  }

  const trailerModal = document.getElementById("trailerModal");
  const trailerVideo = document.getElementById("trailerVideo");
  const watchTrailerBtn = document.getElementById("watchTrailer");
  const imageModal = document.getElementById("imageModal");
  const lightboxImage = document.getElementById("lightboxImage");

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.documentElement.classList.add("modal-open");
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    if (modal === trailerModal && trailerVideo) {
      trailerVideo.pause();
      trailerVideo.currentTime = 0;
    }
    if (modal === imageModal && lightboxImage) {
      lightboxImage.src = "";
    }

    if (!document.querySelector(".modal.open")) {
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
    }
  }

  if (watchTrailerBtn) {
    watchTrailerBtn.addEventListener("click", () => {
      openModal(trailerModal);
      if (trailerVideo) {
        trailerVideo.currentTime = 0;
        const playPromise = trailerVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log("Trailer play requested:", err);
          });
        }
      }
    });
  }

  // Close trailer modal on close button click or click outside modal panel
  if (trailerModal) {
    trailerModal.addEventListener("click", event => {
      if (event.target.closest("[data-close-modal]") || !event.target.closest(".modal-panel")) {
        closeModal(trailerModal);
      }
    });
  }

  // Close image lightbox on close button click or click outside modal panel
  if (imageModal) {
    imageModal.addEventListener("click", event => {
      if (event.target.closest("[data-close-image]") || !event.target.closest(".modal-panel")) {
        closeModal(imageModal);
      }
    });
  }

  document.querySelectorAll(".gallery-card[data-full]").forEach(card => card.addEventListener("click", () => {
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = card.querySelector("img").alt;
    openModal(imageModal);
  }));

  document.getElementById("contactForm").addEventListener("submit", event => {
    event.preventDefault();
    const feedback = document.getElementById("formFeedback");
    if (!event.currentTarget.checkValidity()) { event.currentTarget.reportValidity(); return; }
    feedback.textContent = "Form validated successfully. Sending is not connected yet in this prototype.";
    event.currentTarget.reset();
  });
  const playFeedback = document.getElementById("playFeedback");
  document.getElementById("downloadClient").addEventListener("click", () => playFeedback.textContent = "The game client is a placeholder and is not available to download yet.");
  document.getElementById("playDemo").addEventListener("click", () => playFeedback.textContent = "The WebGL demo is a placeholder and is not available to play yet.");
  document.getElementById("year").textContent = new Date().getFullYear();
});
