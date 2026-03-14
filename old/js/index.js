
// Optional: close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById("searchModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


//--banner--//

const heroBgImage = document.querySelector(".hero-bg-image");

const images = [
    "images/home/jawa.png",
    "images/home/activa.png",
    "images/home/duke.png"
];

let currentIndex = 0;

function updateBackgroundImage() {
    heroBgImage.style.opacity = 0;

    setTimeout(() => {
        heroBgImage.style.backgroundImage = `url('${images[currentIndex]}')`;
        heroBgImage.style.opacity = 1;
        currentIndex = (currentIndex + 1) % images.length;
    }, 400); // matches CSS transition
}

// Initial call
updateBackgroundImage();
setInterval(updateBackgroundImage, 2500);


// --FEATURED BIKE--//

const featured = document.querySelector('.featured-bikes');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            featured.classList.add('visible');
        } else {
            featured.classList.remove('visible');
        }
    });
}, {
    threshold: 0.2,
});

observer.observe(featured);



const track = document.getElementById('carousel-track');
const cards = Array.from(track.children);
const totalCards = cards.length;
const visibleCards = 3;
let index = 0;

// Clone first few cards to simulate infinite scroll
for (let i = 0; i < visibleCards; i++) {
    track.appendChild(cards[i].cloneNode(true));
}

function moveCarousel() {
    index++;
    track.style.transition = 'transform 1s ease';
    track.style.transform = `translateX(-${(index * 100) / 3}%)`;

    // Reset to start smoothly after 5th scroll (when we hit the clone)
    if (index === totalCards) {
        setTimeout(() => {
            track.style.transition = 'none';
            index = 0;
            track.style.transform = `translateX(0%)`;
        }, 1000); // Match transition duration
    }
}

setInterval(moveCarousel, 2500);


//--ABOUT-US--//

const imageContainer = document.querySelector('.about-image-carousel');
const image = imageContainer?.querySelectorAll('img');

if (image && image.length > 1) {
  let currentIndex = 0;

  setInterval(() => {
    // Remove current active
    image[currentIndex].classList.remove('active');

    // Calculate next index
    currentIndex = (currentIndex + 1) % image.length;

    // Add active to next image
    image[currentIndex].classList.add('active');
  }, 2500); // 2.5 seconds
}


const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
        } else {
            entry.target.classList.remove('animate-visible'); // 🔁 re-trigger animation
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.about-section .about-text, .about-section .about-image').forEach(el => {
    el.classList.add('animate-hidden');
    aboutObserver.observe(el);
});



const testimonials = document.querySelector('.testimonial-cards');

const testimonialObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            testimonials.classList.add('visible');
        } else {
            entry.target.classList.remove('visible'); // 🔁 re-trigger animation
        }
    });
}, {
    threshold: 0.2
});

testimonialObserver.observe(testimonials);


document.getElementById("indexSearch").addEventListener("keydown", function(e) {
  if (e.key === "Enter") indexSearch();
});


