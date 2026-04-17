async function fetchFeaturedBikes() {
  const container = document.getElementById("featured-bikes-container");
  const endpoint = "/api/vehicle/website/latest";

  try {
    const response = await fetch(endpoint);
    const bikes = await response.json();

    // Ensure data is an array (handle single object or array)
    const bikesArray = Array.isArray(bikes) ? bikes : [bikes];

    container.innerHTML = bikesArray
      .map((bike) => {
        // Parse the image string if it's a JSON array string
        const images = JSON.parse(bike.vehicleImage);
        const primaryImage =
          `/api/uploads/${images[0]}` ||
          "placeholder-bike.jpg";

        return `
                <div class="swiper-slide">
                    <div class="bg-white rounded-2xl overflow-hidden border border-brand-primary/5 group hover:shadow-xl transition-all duration-300">
                        <div class="relative overflow-hidden">
                            <img src="${primaryImage}" alt="${bike.vehicleBrand} ${bike.vehicleModel}" class="w-full max-h-50 overflow-hidden  object-cover group-hover:scale-110 transition-transform duration-500">
                            <div class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-brand-primary ">
                                ReRide Certified
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="text-xl font-bold text-brand-primary">${bike.vehicleBrand} ${bike.vehicleModel}</h3>
                            </div>
                            <div class="flex gap-4 mb-6 text-sm text-brand-gray">
                                <span class="flex items-center gap-1"><i data-lucide="gauge" class="w-4 h-4"></i> ${bike.vehicleMileage} km</span>
                                <span class="flex items-center gap-1"><i data-lucide="user" class="w-4 h-4"></i> ${bike.vehicleOwnerType}</span>
                                <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-4 h-4"></i> ${bike.vehicleModelYear}</span>
                            </div>
                            <div class="flex items-center justify-between pt-6 border-t border-brand-primary/5">
                                <div>
                                    <span class="block text-xs text-brand-gray uppercase font-semibold">Price</span>
                                    <span class="text-xl font-bold text-brand-primary">₹${Number(bike.vehicleOutLetPrice).toLocaleString()}</span>
                                </div>
                                <a href="./details.html?id=${bike.vehicleId}" class="bg-brand-primary text-sm md:text-md text-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:font-bold hover:bg-brand-primary/90 transition-colors">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");

    // Re-initialize Lucide Icons for new content
    lucide.createIcons();

    // Initialize Swiper
    new Swiper(".featuredSwiper", {
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-next",
        prevEl: ".swiper-prev",
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  } catch (error) {
    console.error("Error fetching bikes:", error);
    container.innerHTML =
      '<p class="text-red-500">Failed to load featured bikes. Please try again later.</p>';
  }
}

// Call on load
document.addEventListener("DOMContentLoaded", fetchFeaturedBikes);
