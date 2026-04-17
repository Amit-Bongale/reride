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
      `/api/vehicle/website/getVehicle/${id}`,
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
  const imageBaseUrl = "/api/uploads/";

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



// ==========================================
// Test Ride Modal & Form Logic
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("test-ride-modal");
  const bookBtn = document.getElementById("book-test-ride-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const dateInput = document.getElementById("trDate");
  const form = document.getElementById("testRideForm");

  // 1. Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;

  // 2. Fetch Branches for the select dropdown
  fetchBranches();

  // 3. Modal Toggle Logic
  if (bookBtn) {
    bookBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      lucide.createIcons(); // Ensure the 'X' icon renders if it hasn't
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Close modal when clicking outside the white box
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // 4. Handle Form Submission
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get the vehicle ID from the URL since we need it for the payload
      const urlParams = new URLSearchParams(window.location.search);
      const currentVehicleId = urlParams.get("id");

      // Time validation check (fallback for older browsers that ignore min/max on time inputs)
      const selectedTime = document.getElementById("trTime").value;
      if (selectedTime < "09:00" || selectedTime > "20:00") {
        alert("Please select a time between 9:00 AM and 8:00 PM.");
        return;
      }

      const formData = {
        testRideCustomerName: document.getElementById("trName").value,
        testRideCustomerEmail: document.getElementById("trEmail").value,
        testRideCustomerPhoneNo: document.getElementById("trMobile").value,
        testRideDate: document.getElementById("trDate").value,
        testRideTime: document.getElementById("trTime").value,
        branchId: document.getElementById("select-location").value,
        vehicle: {
          vehicleId: currentVehicleId,
        },
      };

      try {
        const response = await fetch("/api/testRide/bookTestRide", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        alert("Test ride request submitted successfully!");
        
        // Reset form and close modal on success
        form.reset();
        modal.classList.add("hidden");

      } catch (error) {
        console.error("Error submitting test ride request:", error);
        alert("There was an error submitting your request. Please try again.");
      }
    });
  }
});

// Fetch branches from ReRide backend
async function fetchBranches() {
  try {
    const response = await fetch("/api/branch/website/getBranches");
    if (!response.ok) {
      throw new Error("Failed to fetch branches");
    }
    
    const branches = await response.json();
    const selectLocation = document.getElementById("select-location");
    
    branches.forEach((branch) => {
      const option = document.createElement("option");
      // Note: Make sure "branchId" and "branchName" match the exact keys returned by your Spring Boot API
      option.value = branch.branchId; 
      option.textContent = branch.branchArea; 
      selectLocation.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching branches:", error);
    // Optional: Populate with a fallback or show an error state in the dropdown
  }
}