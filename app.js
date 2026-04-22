const pageShell = document.querySelector(".page-shell");
const progressBar = document.querySelector(".scroll-progress__bar");
const revealItems = document.querySelectorAll(".reveal");
const sceneSections = document.querySelectorAll(".scene-section");
const navLinks = document.querySelectorAll(".site-header__link");
const mobileToggle = document.querySelector(".site-header__mobile-toggle");
const mobilePanel = document.querySelector(".site-header__mobile-panel");
const yearNode = document.querySelector("#year");
const contactForm = document.querySelector("#contact-form");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sceneObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const scene = entry.target.dataset.scene;
      pageShell.dataset.sceneActive = scene;

      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("is-active", active);
      });
    });
  },
  {
    threshold: 0.45,
    rootMargin: "-10% 0px -35% 0px",
  }
);

sceneSections.forEach((section) => sceneObserver.observe(section));

document.addEventListener("scroll", () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;
});

if (mobileToggle && mobilePanel) {
  mobileToggle.addEventListener("click", () => {
    const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
    mobileToggle.setAttribute("aria-expanded", String(!expanded));
    mobilePanel.hidden = expanded;
  });

  mobilePanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileToggle.setAttribute("aria-expanded", "false");
      mobilePanel.hidden = true;
    });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const gmailComposeUrl =
      `https://mail.google.com/mail/?view=cm&fs=1&to=hungtheng2004@gmail.com&su=${subject}&body=${body}`;

    window.open(gmailComposeUrl, "_blank", "noopener,noreferrer");
  });
}
