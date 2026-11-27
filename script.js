"use strict";

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#primary-menu");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  menu.classList.remove("is-open");
}

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
    menu.classList.toggle("is-open", !isExpanded);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const feedback = document.querySelector("#form-feedback");

  function setFieldError(field, hasError) {
    if (hasError) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
  }

  contactForm.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => setFieldError(field, false));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.textContent = "";
    feedback.classList.remove("error");

    const name = contactForm.elements.name;
    const email = contactForm.elements.email;
    const subject = contactForm.elements.subject;
    const message = contactForm.elements.message;
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    const checks = [
      [name, name.value.trim().length === 0],
      [email, !emailIsValid],
      [message, message.value.trim().length === 0],
    ];

    checks.forEach(([field, invalid]) => setFieldError(field, invalid));
    const firstInvalid = checks.find(([, invalid]) => invalid);
    if (firstInvalid) {
      const [field] = firstInvalid;
      feedback.textContent = field === email
        ? "Please enter a valid email address."
        : "Please complete the required fields.";
      feedback.classList.add("error");
      field.focus();
      return;
    }

    const mailto = new URL("mailto:gobi@example.com");
    mailto.searchParams.set("subject", subject.value.trim() || "Website project inquiry");
    mailto.searchParams.set("body", `From: ${name.value.trim()} <${email.value.trim()}>\n\n${message.value.trim()}`);
    feedback.textContent = "Your details look good. Your email app will open to send your note.";
    window.location.href = mailto.toString();
  });
}
