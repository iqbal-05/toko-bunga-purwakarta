// ================= Navbar Toggle =================
const menuToggle = document.getElementById("menu-toggle");
const menu = document.querySelector(".menu ul");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// Scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ================= Hero Slider (dengan dots) =================
const heroSlider = document.querySelector(".hero-slider-wrapper");
const heroSlides = document.querySelectorAll(".hero-slide");
const heroDotsContainer = document.querySelector(".hero-dots");

let heroIndex = 0;

// Buat dots otomatis
heroSlides.forEach((_, i) => {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  heroDotsContainer.appendChild(dot);

  dot.addEventListener("click", () => {
    heroIndex = i;
    updateHeroSlider();
    resetHeroAutoSlide();
  });
});

const heroDots = document.querySelectorAll(".hero-dots span");

function updateHeroSlider() {
  heroSlider.style.transform = `translateX(-${heroIndex * 100}%)`;
  heroDots.forEach(d => d.classList.remove("active"));
  heroDots[heroIndex].classList.add("active");
}

// Auto slide hero
function nextHeroSlide() {
  heroIndex = (heroIndex + 1) % heroSlides.length;
  updateHeroSlider();
}
let heroInterval = setInterval(nextHeroSlide, 4000);

function resetHeroAutoSlide() {
  clearInterval(heroInterval);
  heroInterval = setInterval(nextHeroSlide, 4000);
}

// ================= Galeri Slider =================
const galeriTrack = document.querySelector(".slider-track");
const galeriSlides = document.querySelectorAll(".galeri .slide");
const galeriDotsContainer = document.querySelector(".slider-dots");

let galeriIndex = 0;

// Buat dots sesuai jumlah slide
galeriSlides.forEach((_, i) => {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  galeriDotsContainer.appendChild(dot);

  // Klik dot → pindah slide
  dot.addEventListener("click", () => {
    galeriIndex = i;
    updateGaleriSlider();
    resetGaleriAutoSlide();
  });
});

const galeriDots = document.querySelectorAll(".slider-dots span");

function updateGaleriSlider() {
  galeriTrack.style.transform = `translateX(-${galeriIndex * 100}%)`;
  galeriDots.forEach(d => d.classList.remove("active"));
  galeriDots[galeriIndex].classList.add("active");
}

// Auto slide setiap 4 detik
function autoGaleriSlide() {
  galeriIndex = (galeriIndex + 1) % galeriSlides.length;
  updateGaleriSlider();
}

let galeriAutoInterval = setInterval(autoGaleriSlide, 4000);

function resetGaleriAutoSlide() {
  clearInterval(galeriAutoInterval);
  galeriAutoInterval = setInterval(autoGaleriSlide, 4000);
}

// ================= Animasi Scroll Universal =================
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show"); // reset biar bisa animasi lagi
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(
  ".animate-up, .animate-left, .animate-right, \
  .about-container, .about-photo, .about-content, .about-card, \
  .blog-card, \
  .produk-item, .daftar-produk, .produk-list, \
  .galeri, .slider-track, .slide"
).forEach(el => scrollObserver.observe(el));

// ================= FAQ Accordion =================
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    item.classList.toggle("active");
    faqItems.forEach(i => {
      if (i !== item) i.classList.remove("active");
    });
  });
});
