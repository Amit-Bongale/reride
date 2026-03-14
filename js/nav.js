// document.getElementById("hamburger").addEventListener("click", () => {
//   document.getElementById("navMenu").classList.toggle("active");
// });

// Mobile Menu Toggle
const menuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  mobileMenu.classList.toggle("flex");
});

// Navbar Scroll Effect
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    navbar.classList.add("glass-nav", "shadow-sm");
    navbar.classList.remove("py-4");
    navbar.classList.add("py-2");
  } else {
    navbar.classList.remove("glass-nav", "shadow-sm", "py-2");
    navbar.classList.add("py-4");
  }
});