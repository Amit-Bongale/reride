lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
  // 1. Get the ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const vehicleId = urlParams.get("id");

  if (!vehicleId) {
    showError("No vehicle ID provided.");
    return;
  }

  fetchVehicleDetails(vehicleId);
});

async function fetchVehicleDetails(id) {
  try {
    // Adjust this endpoint path based on your exact Spring Boot routing!
    const response = await fetch(
      `http://localhost:8080/vehicle/website/getVehicle/${id}`,
    );

    if (!response.ok) {
      throw new Error("Vehicle not found");
    }

    const vehicle = await response.json();
    populateDOM(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    showError("Sorry, we couldn't load the details for this vehicle.");
  }
}

function populateDOM(vehicle) {
  // Hide loading, show content
  document.getElementById("status-message").classList.add("hidden");
  document.getElementById("content-container").classList.remove("hidden");

  // Build Strings
  const fullName = `${vehicle.vehicleBrand || ""} ${vehicle.vehicleModel || ""}`;

  // Update Text Elements
  document.getElementById("page-title").textContent = `${fullName} | ReRide`;
  document.getElementById("vehicle-name").textContent = fullName;
  document.getElementById("vehicle-price").textContent =
    `₹${vehicle.vehicleOutLetPrice || "N/A"}`;
  document.getElementById("vehicle-odometer").textContent =
    vehicle.vehicleRegisterNumber || "0";
  document.getElementById("vehicle-year").textContent =
    vehicle.vehicleModelYear || "N/A";
  document.getElementById("vehicle-type").textContent =
    vehicle.vehicleType || "N/A";
  document.getElementById("vehicle-branch").textContent =
    vehicle.vehicleInspectionBranch || "N/A";
  document.getElementById("vehicle-mileage").textContent =
    `${vehicle.vehicleMileage} Kmpl` || "N/A";
  document.getElementById("vehicle-ownership").textContent =
    vehicle.vehicleOwnerType || "N/A";

  // Image Carousel Logic
  const mainSliderWrapper = document.getElementById("main-slider-wrapper");
  const thumbSliderWrapper = document.getElementById("thumb-slider-wrapper");

  // Clear any existing placeholder content
  mainSliderWrapper.innerHTML = "";
  thumbSliderWrapper.innerHTML = "";

  // *** IMPORTANT: Adjust this base URL to match where your backend serves images ***
  const imageBaseUrl = "http://localhost:8080/uploads/";

  let imageArray = [];

  // Parse the stringified JSON array from the backend
  if (vehicle.vehicleImage) {
    try {
      imageArray = JSON.parse(vehicle.vehicleImage);
    } catch (e) {
      console.error("Failed to parse vehicle images:", e);
    }
  }

  // Fallback if no images are found or parsing fails
  if (imageArray.length === 0) {
    imageArray = [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    ];
  }

  // Loop through the array and inject slides
  imageArray.forEach((imageName) => {
    // If it's the fallback URL, don't append the base URL
    const imgUrl = imageName.startsWith("http")
      ? imageName
      : `${imageBaseUrl}${imageName}`;

    mainSliderWrapper.innerHTML += `
                <div class="swiper-slide">
                  <img src="${imgUrl}" alt="${fullName}" class="w-full h-full object-cover" />
                </div>
              `;

    thumbSliderWrapper.innerHTML += `
                <div class="swiper-slide cursor-pointer aspect-video rounded-xl overflow-hidden">
                  <img src="${imgUrl}" alt="${fullName} thumbnail" class="w-full h-full object-cover" />
                </div>
              `;
  });

  // IMPORTANT: Initialize Swiper AFTER the DOM has the new image slides
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initializeSwiper();
    });
  });
}

// function initializeSwiper() {
//   var swiper = new Swiper(".mySwiper", {
//     spaceBetween: 10,
//     slidesPerView: 4,
//     freeMode: true,
//     watchSlidesProgress: true,
//   });

//   var swiper2 = new Swiper(".mySwiper2", {
//     spaceBetween: 10,
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//     thumbs: {
//       swiper: swiper,
//     },
//   });
// }

function initializeSwiper() {
  var swiper = new Swiper(".mySwiper", {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });
    var swiper2 = new Swiper(".mySwiper2", {
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: swiper,
      },
    });
}

function showError(message) {
  const statusDiv = document.getElementById("status-message");
  statusDiv.innerHTML = `<h2 class="text-2xl font-bold text-red-500">${message}</h2>
                                 <a href="./buy.html" class="text-brand-primary underline mt-4 inline-block">Go back to all vehicles</a>`;
  document.getElementById("content-container").classList.add("hidden");
}
