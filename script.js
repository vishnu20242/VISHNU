// ============================================================
// Main JavaScript for Fresher Portfolio
// - Handles loader, smooth scrolling, mobile nav, theme toggle,
//   animated skill bars, and simple contact form validation.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // Page Loader
  // -----------------------------
  const loader = document.getElementById("page-loader");
  // Use a small timeout to show the loader briefly
  window.setTimeout(() => {
    loader?.classList.add("hidden");
  }, 600);

  // -----------------------------
  // Smooth scrolling for nav links (extra handling)
  // -----------------------------
  const navLinks = document.querySelectorAll(".nav-link");
  const header = document.querySelector(".header");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const elementTop = targetEl.getBoundingClientRect().top + window.scrollY;
      const scrollTo = elementTop - headerHeight + 4;

      window.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      });

      // Close mobile nav after click
      closeMobileNav();
    });
  });

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll("section[id]");

  const onScroll = () => {
    const scrollY = window.scrollY;
    const headerOffset = header ? header.offsetHeight + 60 : 120;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.scrollY - headerOffset;
      const bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        const id = section.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  };

  window.addEventListener("scroll", onScroll);
  onScroll();

  // -----------------------------
  // Mobile navigation toggle
  // -----------------------------
  const navToggle = document.getElementById("nav-toggle");
  const navList = document.querySelector(".nav-list");

  const closeMobileNav = () => {
    navList?.classList.remove("open");
    navToggle?.classList.remove("open");
  };

  navToggle?.addEventListener("click", () => {
    navList?.classList.toggle("open");
    navToggle.classList.toggle("open");
  });

  // Close nav when clicking outside on small screens
  document.addEventListener("click", (event) => {
    if (!navList || !navToggle) return;
    const target = event.target;
    const clickedInsideNav = navList.contains(target) || navToggle.contains(target);

    if (!clickedInsideNav && navList.classList.contains("open")) {
      closeMobileNav();
    }
  });

  // -----------------------------
  // Dark / Light Theme Toggle
  // -----------------------------
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIconSpan = document.querySelector(".theme-icon");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const THEME_KEY = "fp-theme";

  // Apply saved or preferred theme
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      if (themeIconSpan) themeIconSpan.textContent = "☀️";
    } else {
      document.body.classList.remove("dark");
      if (themeIconSpan) themeIconSpan.textContent = "🌙";
    }
  };

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
  } else if (prefersDark.matches) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  themeToggleBtn?.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  });

  // -----------------------------
  // Animated Skill Bars
  // -----------------------------
  const skillBars = document.querySelectorAll(".skill-bar-fill");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const percent = el.getAttribute("data-skill-percent") || "60";
            el.style.width = percent + "%";
          }
        });
      },
      {
        threshold: 0.4,
      }
    );

    skillBars.forEach((bar) => observer.observe(bar));
  } else {
    // Fallback if IntersectionObserver is not supported
    skillBars.forEach((bar) => {
      const percent = bar.getAttribute("data-skill-percent") || "60";
      bar.style.width = percent + "%";
    });
  }

  // -----------------------------
  // Contact Form (front-end validation only)
  // -----------------------------
  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");
  const formStatus = document.getElementById("form-status");

  const validateEmail = (email) => {
    // Very simple email pattern for beginners (not perfect but ok)
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!nameInput || !emailInput || !messageInput) return;

    // Reset error messages
    if (nameError) nameError.textContent = "";
    if (emailError) emailError.textContent = "";
    if (messageError) messageError.textContent = "";
    if (formStatus) {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }

    let isValid = true;

    if (!nameInput.value.trim()) {
      if (nameError) nameError.textContent = "Please enter your name.";
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      if (emailError) emailError.textContent = "Please enter your email.";
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      if (emailError) emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      if (messageError) messageError.textContent = "Please enter a message.";
      isValid = false;
    }

    if (!isValid) {
      if (formStatus) {
        formStatus.textContent = "Please fix the errors above and try again.";
        formStatus.classList.add("error");
      }
      return;
    }

    // Since there is no backend, just show a success message and reset fields.
    if (formStatus) {
      formStatus.textContent =
        "Thank you! Your message has been prepared. Please copy it into your email client to send.";
      formStatus.classList.add("success");
    }

    // Optionally clear fields
    contactForm.reset();
  });

  // -----------------------------
  // Footer year
  // -----------------------------
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }
});

