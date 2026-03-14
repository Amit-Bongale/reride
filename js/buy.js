// --- Core Data ---
let currentStep = 0;
const totalSteps = 10;
const formData = {};

const vehicleData = {
  TVS: [
    "Apache RTR 160",
    "Apache RTR 200",
    "Apache RTX 300",
    "Ronin",
    "Apache RR 310",
    "Apache RTR 310",
    "Jupiter",
    "Ntorq 125",
    "Star City Plus",
  ],
  Bajaj: [
    "Aspire 100",
    "Avenger 200",
    "Avenger Cruise 220",
    "Avenger Street 150",
    "Dominar 400",
    "Platina 100",
    "Pulsar 150",
    "Pulsar NS200",
  ],
  Hero: [
    "Glamour",
    "HF Deluxe",
    "Passion Pro",
    "Splendor Plus",
    "Super Splendor",
  ],
  Honda: ["Activa 6G", "CB Shine", "CB Unicorn", "Dio", "Hornet 2.0", "CB350"],
  Yamaha: ["FZ-S", "MT-15", "R15 V3", "R15 V4", "Ray ZR"],
  "Royal Enfield": [
    "Bullet 350",
    "Classic 350",
    "Himalayan",
    "Interceptor 650",
    "Meteor 350",
    "Hunter 350",
  ],
  Suzuki: ["Access 125", "Burgman Street", "Gixxer"],
  KTM: ["125 Duke", "200 Duke", "250 Duke", "390 Duke", "RC 200"],
  Kawasaki: ["Ninja 300", "Ninja 400", "Z650"],
  OLA: ["S1", "S1 Pro", "S1 Air"],
  Vespa: ["Elegante 150", "SXL 150"],
  Ultraviolette: ["X47", "X47 Crossover"],
};

const colorMap = {
  Red: "#ef4444",
  Black: "#1f2937",
  White: "#ffffff",
  Blue: "#3b82f6",
  Grey: "#6b7280",
  Silver: "#d1d5db",
  Green: "#22c55e",
  Yellow: "#eab308",
};

const stepTitles = [
  "",
  "Brand",
  "Vehicle Type",
  "Model",
  "Year",
  "Color",
  "Purchase Details",
  "Ownership",
  "Photos",
  "Inspection",
  "Contact",
];

// --- Navigation Logic ---
function startFlow() {
  document.getElementById("step0").classList.add("hidden");
  document.getElementById("step0").classList.remove("active");
  document.getElementById("formWrapper").classList.remove("hidden");

  // Populate initial grids
  populateBrands();

  showStep(1);
}

function showStep(step) {
  // Hide all
  document.querySelectorAll(".step-content").forEach((el) => {
    el.classList.remove("active");
  });

  // Show target
  currentStep = step;
  document.getElementById(`step${step}`).classList.add("active");

  // Update Header
  document.getElementById("stepTitleText").textContent = stepTitles[step];
  document.getElementById("stepCounterText").textContent =
    `${step}/${totalSteps}`;
  document.getElementById("progressBar").style.width =
    `${(step / totalSteps) * 100}%`;

  // Back button visibility
  document.getElementById("backBtn").classList.toggle("hidden", step <= 1);

  // Trigger specific step load logic
  loadStepContent();
}

function nextStep(stepNum) {
  if (stepNum < totalSteps) {
    showStep(stepNum + 1);
  }
}

function previousStep() {
  if (currentStep > 1) {
    showStep(currentStep - 1);
  } else {
    // Go back to landing
    document.getElementById("formWrapper").classList.add("hidden");
    document.getElementById("step0").classList.remove("hidden");
    document.getElementById("step0").classList.add("active");
  }
}

function selectOption(type, value, stepNumber, element) {
  formData[type] = value;

  // Handle active styling
  const container = document.getElementById(`step${stepNumber}`);
  container.querySelectorAll(".option-card").forEach((opt) => {
    opt.classList.remove("selected");
  });
  element.classList.add("selected");

  // Auto advance
  setTimeout(() => {
    nextStep(stepNumber);
  }, 300);
}

// --- Dynamic Content Loaders ---
function loadStepContent() {
  switch (currentStep) {
    case 3:
      populateModels();
      break;
    case 4:
      populateYears();
      break;
    case 5:
      populateColors();
      break;
    case 6:
      initPurchaseWatchers();
      break;
    case 8:
      initPhotoWatchers();
      break;
    case 9:
      initInspectionWatchers();
      break;
    case 10:
      initContactWatchers();
      break;
  }
}

function populateBrands() {
  const grid = document.getElementById("brandGrid");
  grid.innerHTML = "";
  Object.keys(vehicleData).forEach((brand) => {
    const div = document.createElement("div");
    div.className =
      "option-card cursor-pointer bg-white border border-brand-primary/10 rounded-xl p-4 text-center hover:border-brand-primary/30 flex flex-col items-center justify-center gap-2";
    div.onclick = function () {
      selectOption("brand", brand, 1, this);
    };

    // Generic text logo representation
    div.innerHTML = `
            <div class="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center font-black text-brand-primary text-sm uppercase tracking-tighter">
                ${brand.substring(0, 3)}
            </div>
            <span class="font-bold text-sm text-brand-primary">${brand}</span>
        `;
    grid.appendChild(div);
  });
}

function populateModels() {
  const grid = document.getElementById("modelList");
  grid.innerHTML = "";
  const models = vehicleData[formData.brand] || [];

  models.forEach((model) => {
    const div = document.createElement("div");
    div.className =
      "option-card model-item cursor-pointer bg-white border border-brand-primary/10 rounded-xl p-4 hover:border-brand-primary/30 font-semibold text-brand-primary transition-colors";
    div.textContent = model;
    div.onclick = function () {
      selectOption("model", model, 3, this);
    };
    grid.appendChild(div);
  });
  document.getElementById("modelSearch").value = "";
}

function filterModels() {
  const term = document.getElementById("modelSearch").value.toLowerCase();
  document.querySelectorAll(".model-item").forEach((item) => {
    item.style.display = item.textContent.toLowerCase().includes(term)
      ? "block"
      : "none";
  });
}

function populateYears() {
  const grid = document.getElementById("yearGrid");
  if (grid.children.length > 0) return; // already loaded

  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 15; y--) {
    const div = document.createElement("div");
    div.className =
      "option-card cursor-pointer bg-white border border-brand-primary/10 rounded-xl py-3 text-center hover:border-brand-primary/30 font-bold text-brand-primary";
    div.textContent = y;
    div.onclick = function () {
      selectOption("year", y, 4, this);
    };
    grid.appendChild(div);
  }
}

function populateColors() {
  const grid = document.getElementById("colorGrid");
  if (grid.children.length > 0) return;

  Object.entries(colorMap).forEach(([colorName, hex]) => {
    const div = document.createElement("div");
    div.className =
      "option-card cursor-pointer bg-white border border-brand-primary/10 rounded-xl p-4 text-center hover:border-brand-primary/30 flex flex-col items-center gap-3";
    div.onclick = function () {
      selectOption("color", colorName, 5, this);
    };

    let borderClass = colorName === "White" ? "border border-gray-300" : "";

    div.innerHTML = `
            <div class="w-10 h-10 rounded-full shadow-inner ${borderClass}" style="background-color: ${hex}"></div>
            <span class="text-sm font-semibold text-brand-primary">${colorName}</span>
        `;
    grid.appendChild(div);
  });
}

// --- Step 6: Purchase Check ---
function initPurchaseWatchers() {
  const btn = document.getElementById("purchase-btn");
  const check = () => {
    const y = document.getElementById("purchaseYear").value;
    const a = document.getElementById("purchaseAmount").value;
    if (y && a > 0) {
      btn.classList.remove("hidden");
      formData.purchaseDate = y;
      formData.purchaseAmount = a;
    } else {
      btn.classList.add("hidden");
    }
  };
  document.getElementById("purchaseYear").addEventListener("change", check);
  document.getElementById("purchaseAmount").addEventListener("input", check);
}

// --- Step 8: Photos & Reg ---
formData.photos = {
  front: null,
  back: null,
  left: null,
  right: null,
  odometer: null,
};
formData.vehicleImages = [];

function handlePhotoUpload(event, angle) {
  const file = event.target.files[0];
  if (!file) return;

  formData.photos[angle] = file;

  // Render preview
  const reader = new FileReader();
  reader.onload = (e) => {
    const previewDiv = document.getElementById(`preview-${angle}`);
    const placeholderDiv = document.getElementById(`placeholder-${angle}`);
    const imgElement = previewDiv.querySelector("img");

    imgElement.src = e.target.result;
    previewDiv.classList.remove("hidden");
    placeholderDiv.classList.add("hidden");
  };
  reader.readAsDataURL(file);

  checkRegistrationDetails();
}

function checkRegistrationDetails() {
  const btn = document.getElementById("registration-btn");
  const regInput = document.getElementById("registrationNumber");

  // Check if all 5 photos are uploaded
  const allPhotosUploaded = Object.values(formData.photos).every(
    (photo) => photo !== null,
  );

  if (regInput.value.trim().length > 4 && allPhotosUploaded) {
    btn.classList.remove("hidden");
    formData.registrationNumber = regInput.value.toUpperCase();
    // Store flattened array for submission logic
    formData.vehicleImages = Object.values(formData.photos);
  } else {
    btn.classList.add("hidden");
  }
}

function initPhotoWatchers() {
  const regInput = document.getElementById("registrationNumber");
  regInput.addEventListener("input", checkRegistrationDetails);
}

// --- Step 9: Inspection ---
function initInspectionWatchers() {
  const dateInput = document.getElementById("inspectionDate");
  const locInput = document.getElementById("inspectionLocation");
  const btn = document.getElementById("inspection-btn");

  // Set min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split("T")[0];

  // Mock Data fetching logic (Replaces actual fetch for UI preview)
  if (locInput.options.length <= 1) {
    const mockBranches = [
      { branchId: "1", branchArea: "Indiranagar Hub" },
      { branchId: "2", branchArea: "Koramangala Hub" },
      { branchId: "3", branchArea: "Whitefield Center" },
    ];
    mockBranches.forEach((b) => {
      locInput.innerHTML += `<option value="${b.branchId}">${b.branchArea}</option>`;
    });

    /* // Original Fetch Logic kept for backend integration
        fetch("/api/branch/website/getBranches")
            .then(r => r.json())
            .then(data => {
                data.forEach(b => locInput.innerHTML += `<option value="${b.branchId}">${b.branchArea}</option>`);
            });
        */
  }

  const check = () => {
    if (dateInput.value && locInput.value) {
      btn.classList.remove("hidden");
      formData.inspectionDate = dateInput.value;
      formData.branchId = locInput.value;
      formData.inspectionLocation =
        locInput.options[locInput.selectedIndex].text;
    } else {
      btn.classList.add("hidden");
    }
  };

  dateInput.addEventListener("change", check);
  locInput.addEventListener("change", check);
}

// --- Step 10: Final Form Submit ---
function initContactWatchers() {
  const name = document.getElementById("fullName");
  const phone = document.getElementById("mobileNumber");
  const email = document.getElementById("emailAddress");
  const btn = document.getElementById("contact-btn");

  const check = () => {
    if (
      name.value.trim() &&
      phone.value.trim().length >= 10 &&
      email.value.includes("@")
    ) {
      btn.classList.remove("hidden");
      formData.fullName = name.value;
      formData.mobileNumber = phone.value;
      formData.emailAddress = email.value;
    } else {
      btn.classList.add("hidden");
    }
  };

  name.addEventListener("input", check);
  phone.addEventListener("input", check);
  email.addEventListener("input", check);
}

function submitForm() {
  const btn = document.getElementById("contact-btn");
  const text = document.getElementById("submit-text");
  const icon = document.getElementById("submit-icon");
  const loader = document.getElementById("submit-loader");

  // UI Loading state
  text.textContent = "Uploading Details...";
  icon.classList.add("hidden");
  loader.classList.remove("hidden");
  btn.classList.add("opacity-80", "cursor-not-allowed");

  // Log output to demonstrate logic
  console.log("Form Data Prepared:", formData);

  // Simulate API Call delay
  setTimeout(() => {
    text.textContent = "Success!";
    loader.classList.add("hidden");
    btn.classList.remove("bg-brand-primary");
    btn.classList.add("bg-green-600");
    icon.classList.remove("hidden");
    lucide.createIcons();

    setTimeout(() => {
      alert(
        "Thank you! Your vehicle details have been submitted successfully. Our team will contact you soon.",
      );
      window.location.reload();
    }, 500);

    /*
        // Original Fetch Payload Logic
        let formPayload = new FormData();
        formPayload.append("vehicle", new Blob([JSON.stringify({
            vehicleBrand: formData.brand, vehicleModel: formData.model,
            // ... other mappings
        })], { type: "application/json" }));
        
        fetch("/api/vehicle/addVehicle", { method: "POST", body: formPayload }).then(...)
        */
  }, 2000);
}
