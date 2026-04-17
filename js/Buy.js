// Initialize icons
lucide.createIcons();

// API Endpoints
// const API_ALL_VEHICLES = "/api/vehicle/website/getVehicles";
const API_SEARCH_VEHICLES =
  "http://prakruthireride.com/api/vehicle/website/getVehicles/search";

// DOM Elements
const vehicleGrid = document.getElementById("vehicle-grid");
const vehicleCount = document.getElementById("vehicle-count");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const sortSelect = document.getElementById("sort-select");
const paginationControls = document.getElementById("pagination-controls");

// State variables
let currentVehiclesList = []; // Holds the filtered and sorted list
let currentPage = 1;
const ITEMS_PER_PAGE = 18;

// Load initial data on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchFilteredVehicles(); // Start by fetching everything
});

// --- 1. Event Listeners ---

// Search only applies when the button is clicked
searchBtn.addEventListener("click", () => {
  fetchFilteredVehicles();
});

// Filters apply immediately on change
document.querySelectorAll(".filter-input").forEach((input) => {
  input.addEventListener("change", () => {
    fetchFilteredVehicles();
  });
});

// Sorting applies immediately
sortSelect.addEventListener("change", () => {
  applySorting();
  currentPage = 1;
  renderPage();
});

// --- 2. Data Fetching & Processing ---

async function fetchFilteredVehicles() {
  try {
    const url = new URL(API_SEARCH_VEHICLES);

    // 1. Get Search Term
    const searchTerm = searchInput.value.trim();
    if (searchTerm) url.searchParams.append("vehicleModel", searchTerm);

    // 2. Get Selected Brands (Using Set to prevent duplicates between desktop and mobile menus)
    const selectedBrands = [
      ...new Set(
        Array.from(document.querySelectorAll(".brand-filter:checked")).map(
          (cb) => cb.value,
        ),
      ),
    ];
    if (selectedBrands.length > 0)
      url.searchParams.append("vehicleBrand", selectedBrands.join(","));

    // 3. Get Selected Types (Using Set to prevent duplicates)
    const selectedTypes = [
      ...new Set(
        Array.from(document.querySelectorAll(".type-filter:checked")).map(
          (cb) => cb.value,
        ),
      ),
    ];
    if (selectedTypes.length > 0)
      url.searchParams.append("vehicleType", selectedTypes.join(","));

    // 4. Get Selected Years (Now passed directly to your API)
    const selectedYears = [
      ...new Set(
        Array.from(document.querySelectorAll(".year-filter:checked")).map(
          (cb) => cb.value,
        ),
      ),
    ];
    if (selectedYears.length > 0)
      url.searchParams.append("vehicleModelYear", selectedYears.join(","));

    // Include sorting params for the backend (so you can use it later when implemented in Spring Boot)
    url.searchParams.append("sortBy", sortSelect.value);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    let data = await response.json();

    // --- Client-Side filtering for things the API endpoint doesn't support yet ---

    // Filter by Price Range
    const selectedPrice = document.querySelector(
      ".price-filter:checked",
    )?.value;
    if (selectedPrice) {
      const [min, max] = selectedPrice.split("-").map(Number);
      data = data.filter((v) => {
        const price = parseFloat(v.vehicleOutLetPrice);
        return !isNaN(price) && price >= min && price <= max;
      });
    }

    currentVehiclesList = data;
    applySorting(); // Sort the data

    // Reset to page 1 and render
    currentPage = 1;
    renderPage();
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    vehicleGrid.innerHTML =
      '<p class="text-red-500 col-span-3 text-center py-12">Error loading vehicles. Please check server connection.</p>';
  }
}
function clearAllFilters() {
  // 1. Clear the search input
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";

  // 2. Uncheck Vehicle Type checkboxes
  document.querySelectorAll('.type-filter[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });

  // 3. Reset Price, Brand, and Year radio buttons to their default (value="")
  const radioClassesToReset = ['.price-filter', '.brand-filter', '.year-filter', '.type-filter'];
  
  radioClassesToReset.forEach(className => {
    document.querySelectorAll(className).forEach((radio) => {
      if (radio.value === "") {
        radio.checked = true; // Select the "All" / "Any" option
      } else {
        radio.checked = false;
      }
      
    });
  });

  // 4. Reset the sort dropdown to "Relevance"
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) sortSelect.value = "relevance";

  // 5. Re-fetch the vehicles
  fetchFilteredVehicles();
}

// --- 3. Sorting Logic ---
function applySorting() {
  const sortValue = sortSelect.value;

  currentVehiclesList.sort((a, b) => {
    const priceA = parseFloat(a.vehicleOutLetPrice) || 0;
    const priceB = parseFloat(b.vehicleOutLetPrice) || 0;

    if (sortValue === "price_asc") return priceA - priceB;
    if (sortValue === "price_desc") return priceB - priceA;
    if (sortValue === "mileage_desc") {
      return parseFloat(b.vehicleMileage) - parseFloat(a.vehicleMileage);
    }
    // 'relevance' keeps the original array order
    return 0;
  });
}

// --- 4. Pagination & Rendering ---

function renderPage() {
  vehicleCount.textContent = currentVehiclesList.length;
  vehicleGrid.innerHTML = "";

  if (currentVehiclesList.length === 0) {
    vehicleGrid.innerHTML =
      '<p class="text-gray-500 col-span-3 text-center py-12">No vehicles found matching your criteria.</p>';
    paginationControls.innerHTML = "";
    return;
  }

  // Calculate Slice
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = currentVehiclesList.slice(startIndex, endIndex);

  // Render Cards
  paginatedItems.forEach((vehicle) => {
    const id = vehicle.vehicleId;
    const brand = vehicle.vehicleBrand || "Unknown";
    const model = vehicle.vehicleModel || "Unknown";
    const price = vehicle.vehicleOutLetPrice || "N/A";
    const year = vehicle.vehicleModelYear || "N/A";
    const mileage = vehicle.vehicleMileage || "N/A";
    const type = vehicle.vehicleType || "N/A";

    let imageUrl = "./images/placeholder.png"; // Fallback
    if (vehicle.vehicleImage) {
      try {
        const parsedImage = JSON.parse(vehicle.vehicleImage);
        if (parsedImage.length > 0)
          imageUrl = `/api/uploads/${parsedImage[0]}`;
      } catch (e) {}
    }

    const cardHTML = `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-primary/5 group relative">
          <div class="relative h-48 overflow-hidden">
            <span class="absolute top-3 right-3 bg-brand-primary text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md z-10 tracking-wide">
              ReRide Certified
            </span>
            <img src="${imageUrl}" alt="${brand} ${model}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg text-brand-primary leading-tight">
                ${brand} ${model}
              </h3>
            </div>
            <div class="flex items-center gap-3 text-xs text-brand-gray mb-3">
              <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> ${year}</span>
              <span class="flex items-center gap-1"><i data-lucide="gauge" class="w-3 h-3"></i> ${mileage} km</span>
              <span class="flex items-center gap-1"><i data-lucide="bike" class="w-3 h-3"></i> ${type}</span>
            </div>
            <div class="flex justify-between items-center pt-3 border-t border-gray-50">
              <div>
                <p class="text-xs text-gray-400"> Price</p>
                <p class="text-xl font-bold text-brand-primary">₹${price}</p>
              </div>
              <a href="./details.html?id=${id}">
              <button class="bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                View
              </button> </a>
            </div>
          </div>
        </div>
      `;
    vehicleGrid.insertAdjacentHTML("beforeend", cardHTML);
  });

  lucide.createIcons();
  renderPaginationControls();
}

function renderPaginationControls() {
  const totalPages = Math.ceil(currentVehiclesList.length / ITEMS_PER_PAGE);
  paginationControls.innerHTML = "";

  if (totalPages <= 1) return; // Don't show if there's only 1 page

  // Prev Button
  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = '<i data-lucide="chevron-left" class="w-5 h-5"></i>';
  prevBtn.className = `p-2 rounded-xl border ${currentPage === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"}`;
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
      window.scrollTo(0, 0);
    }
  };
  paginationControls.appendChild(prevBtn);

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.className = `w-10 h-10 rounded-xl font-bold transition-colors cursor-pointer ${currentPage === i ? "bg-brand-primary text-white" : "border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white"}`;
    pageBtn.onclick = () => {
      currentPage = i;
      renderPage();
      window.scrollTo(0, 0);
    };
    paginationControls.appendChild(pageBtn);
  }

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = '<i data-lucide="chevron-right" class="w-5 h-5"></i>';
  nextBtn.className = `p-2 rounded-xl border ${currentPage === totalPages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"}`;
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
      window.scrollTo(0, 0);
    }
  };
  paginationControls.appendChild(nextBtn);

  lucide.createIcons();
}
