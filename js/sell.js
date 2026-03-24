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
  document.getElementById("customBrandContainer").classList.add("hidden"); // Reset custom input

  Object.keys(vehicleData).forEach((brand) => {
    const div = document.createElement("div");
    div.className =
      "option-card cursor-pointer bg-white border border-brand-primary/10 rounded-xl p-4 text-center hover:border-brand-primary/30 flex flex-col items-center justify-center gap-2";
    div.onclick = function () {
      document.getElementById("customBrandContainer").classList.add("hidden");
      selectOption("brand", brand, 1, this);
    };

    div.innerHTML = `
            <div class="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center font-black text-brand-primary text-sm uppercase tracking-tighter">
                ${brand.substring(0, 3)}
            </div>
            <span class="font-bold text-sm text-brand-primary">${brand}</span>
        `;
    grid.appendChild(div);
  });
  const otherDiv = document.createElement("div");
  otherDiv.className =
    "option-card cursor-pointer bg-white border border-brand-primary/10 rounded-xl p-4 text-center hover:border-brand-primary/30 flex flex-col items-center justify-center gap-2";
  otherDiv.onclick = function () {
    grid
      .querySelectorAll(".option-card")
      .forEach((opt) => opt.classList.remove("selected"));
    this.classList.add("selected");
    document.getElementById("customBrandContainer").classList.remove("hidden");
    document.getElementById("customBrandInput").value = "";
    document.getElementById("customBrandInput").focus();
  };
  otherDiv.innerHTML = `
      <div class="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary">
          <i data-lucide="plus" class="w-6 h-6"></i>
      </div>
      <span class="font-bold text-sm text-brand-primary">Others</span>
  `;
  grid.appendChild(otherDiv);
  lucide.createIcons(); // Render the plus icon
}

function populateModels() {
  const grid = document.getElementById("modelList");
  grid.innerHTML = "";
  document.getElementById("customModelContainer").classList.add("hidden"); // Reset custom input

  const models = vehicleData[formData.brand] || [];

  models.forEach((model) => {
    const div = document.createElement("div");
    div.className =
      "option-card model-item cursor-pointer bg-white border border-brand-primary/10 rounded-xl p-4 hover:border-brand-primary/30 font-semibold text-brand-primary transition-colors";
    div.textContent = model;
    div.onclick = function () {
      document.getElementById("customModelContainer").classList.add("hidden");
      selectOption("model", model, 3, this);
    };
    grid.appendChild(div);
  });

  // Add "Others" Option
  const otherDiv = document.createElement("div");
  otherDiv.className =
    "option-card model-item cursor-pointer bg-brand-bg/50 border border-brand-primary/10 rounded-xl p-4 hover:border-brand-primary/30 font-semibold text-brand-primary transition-colors flex items-center gap-2";
  otherDiv.onclick = function () {
    grid
      .querySelectorAll(".option-card")
      .forEach((opt) => opt.classList.remove("selected"));
    this.classList.add("selected");
    document.getElementById("customModelContainer").classList.remove("hidden");
    document.getElementById("customModelInput").value = "";
    document.getElementById("customModelInput").focus();
  };
  otherDiv.innerHTML = `<i data-lucide="plus" class="w-4 h-4"></i> Others`;
  grid.appendChild(otherDiv);
  lucide.createIcons();

  document.getElementById("modelSearch").value = "";
}

function filterModels() {
  const term = document.getElementById("modelSearch").value.toLowerCase();
  document.querySelectorAll(".model-item").forEach((item) => {
    // Always show 'Others' or if the text matches
    if (item.textContent.toLowerCase().includes("others")) {
      item.style.display = "flex";
    } else {
      item.style.display = item.textContent.toLowerCase().includes(term)
        ? "block"
        : "none";
    }
  });
}

function submitCustomOption(type, stepNumber) {
  let inputVal = "";
  if (type === "brand") {
    inputVal = document.getElementById("customBrandInput").value.trim();
  } else if (type === "model") {
    inputVal = document.getElementById("customModelInput").value.trim();
  }

  if (inputVal) {
    formData[type] = inputVal;
    nextStep(stepNumber);
  } else {
    alert(`Please enter a ${type} name.`);
  }
}

function populateYears() {
  const grid = document.getElementById("yearGrid");
  if (grid.children.length > 0) return; // already loaded

  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 25; y--) {
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
  const purchaseDate = document.getElementById("purchaseYear");
  const today = new Date();
  const localDate = new Date( today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().split("T")[0];
  purchaseDate.max = localDate;

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

  // Fetch actual branches from API if not already populated
  if (locInput.options.length <= 1) {
    fetch("http://localhost:8080/branch/website/getBranches")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((branch) => {
          const option = document.createElement("option");
          option.value = branch.branchId;
          option.textContent = branch.branchArea;
          locInput.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
        locInput.innerHTML =
          '<option value="">Error loading locations</option>';
      });
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
  // Validate required fields
  if (!formData.fullName || !formData.mobileNumber || !formData.emailAddress) {
    alert("Please fill in all required fields");
    return;
  }

  // UI Loading state
  const btn = document.getElementById("contact-btn");
  const text = document.getElementById("submit-text");
  const icon = document.getElementById("submit-icon");
  const loader = document.getElementById("submit-loader");

  text.textContent = "Uploading Details...";
  icon.classList.add("hidden");
  loader.classList.remove("hidden");
  btn.classList.add("opacity-80", "cursor-not-allowed");

  let formPayload = new FormData();

  // --- Vehicle JSON ---
  const vehicleDataPayload = {
    vehicleBrand: formData.brand,
    vehicleModel: formData.model,
    vehicleModelYear: formData.year,
    vehicleColour: formData.color,
    vehiclePurchasedDate: formData.purchaseDate,
    vehiclePurchasedAmount: formData.purchaseAmount,
    vehicleOwnerType: formData.owner,
    vehicleRegisterNumber: formData.registrationNumber,
    vehicleInspectionBranch: formData.inspectionLocation,
    vehicleInspectionDate: formData.inspectionDate,
    vehicleType: formData.vehicleType,
    branchId: formData.branchId,
  };

  // --- User JSON ---
  const userData = {
    userName: formData.fullName,
    userPhoneNo: formData.mobileNumber,
    userEmail: formData.emailAddress,
    userRole: "USER",
  };

  // Append vehicle and user as separate blobs
  formPayload.append(
    "vehicle",
    new Blob([JSON.stringify(vehicleDataPayload)], {
      type: "application/json",
    }),
  );

  formPayload.append(
    "user",
    new Blob([JSON.stringify(userData)], { type: "application/json" }),
  );

  // Append files
  for (let file of formData.vehicleImages || []) {
    formPayload.append("documents", file);
  }

  formPayload.append(
    "inspection",
    new Blob([JSON.stringify({})], { type: "application/json" }),
  );

  // Send request
  fetch("http://localhost:8080/vehicle/addVehicle", {
    method: "POST",
    body: formPayload,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error adding vehicle");
      }

      // Update UI to success state
      text.textContent = "Success!";
      loader.classList.add("hidden");
      btn.classList.remove(
        "bg-brand-primary",
        "opacity-80",
        "cursor-not-allowed",
      );
      btn.classList.add("bg-green-600");
      icon.classList.remove("hidden");
      lucide.createIcons();

      setTimeout(() => {
        alert(
          "Thank you! Your vehicle details have been submitted successfully. Our team will contact you soon.",
        );
        window.location.reload();
      }, 500);

      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
      alert("There was an error submitting your details. Please try again.");

      // Reset UI on failure
      text.textContent = "Submit Details";
      loader.classList.add("hidden");
      btn.classList.remove("opacity-80", "cursor-not-allowed");
    });
}
