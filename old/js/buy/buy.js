let vehicles = [];

// Load the JSON file
// fetch('./json/vehicles.json')
//     .then(res => res.json())
//     .then(data => {
//         vehicles = data.vehicles || [];
//     })
//     .catch(err => {
//         console.error('Failed to load vehicles.json', err);
//     });

const brandEl = document.getElementById('select-brand');
const modelEl = document.getElementById('select-model');
const locationEl = document.getElementById('select-location');
const typeEl = document.getElementById('select-type'); // your type select

// ensure model starts disabled
if (modelEl) {
    modelEl.innerHTML = '<option value="">Select Model</option>';
    modelEl.disabled = true;
}

function updateModels() {
    const selectedBrand = brandEl?.value.trim() || '';
    const selectedType = typeEl?.value.trim().toLowerCase() || '';
    const selectedLocation = locationEl?.value.trim().toLowerCase() || '';
    // alert("brand: "+selectedBrand);
    // alert("type "+selectedType);
    // alert("location: "+selectedLocation);
    if (!modelEl) return;

    modelEl.innerHTML = '<option value="">Select Model</option>';

    if (!selectedBrand || selectedBrand === 'Select Vehicle Brand') {
        modelEl.disabled = true;
        return;
    }

    // Filter by brand (required), and optionally by type/location
    const filtered = vehicles.filter(v => {
        if (!v.Brand || v.Brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;

        if (selectedType && selectedType.toLowerCase() !== 'seach type') {
            // assume your JSON uses field "type" like "bike" or "scooter"
            if (!v.type || v.type.toLowerCase() !== selectedType.toLowerCase()) return false;
        }

        if (selectedLocation && selectedLocation.toLowerCase() !== 'select location') {
            if (!v.Location || v.Location.toLowerCase() !== selectedLocation.toLowerCase()) return false;
        }

        return true;
    });

    const models = [...new Set(filtered.map(v => v.modelName).filter(Boolean))];

    if (models.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'No models found';
        modelEl.appendChild(opt);
        modelEl.disabled = true;
    } else {
        models.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            modelEl.appendChild(opt);
        });
        modelEl.disabled = false;
    }
}

// attach listeners
if (brandEl) brandEl.addEventListener('change', updateModels);
if (typeEl) typeEl.addEventListener('change', updateModels);
if (locationEl) locationEl.addEventListener('change', updateModels);


// //----------- search vehicals--------------------


//   let vehiclesData = [];

//   // preload JSON
//   fetch('./json/vehicles.json')
//     .then(res => {
//       if (!res.ok) throw new Error('Failed to load vehicles.json: ' + res.status);
//       return res.json();
//     })
//     .then(data => {
//       vehiclesData = Array.isArray(data.vehicles) ? data.vehicles : [];
//       console.log('Loaded vehicles:', vehiclesData.length);
//     })
//     .catch(err => {
//       console.error(err);
//     });

//   function normalizeSelect(el, placeholderRegex) {
//     if (!el) return '';
//     const v = el.value.trim();
//     if (!v) return '';
//     if (placeholderRegex && placeholderRegex.test(v)) return '';
//     return v;
//   }

//   function toNumber(str) {
//     if (!str) return null;
//     const cleaned = String(str).replace(/,/g, '').trim();
//     if (cleaned === '') return null;
//     const n = Number(cleaned);
//     return isNaN(n) ? null : n;
//   }

//   function createVehicleCard(vehicle) {
//     const price = vehicle.price != null && vehicle.price !== 'N/A' ? vehicle.price : 'N/A';
//     const modelYear = vehicle["Model Year"] || 'N/A';
//     const mileage = vehicle.actualKms || vehicle.correctedKms || 'N/A';
//     const owner = vehicle["Owner Type"] || 'N/A';
//     const type = vehicle.type || 'N/A';
//     const reg = vehicle["Vehicle Reg No"] || '';
//     const title = `${vehicle.Brand || ''} ${vehicle.modelName || ''}`.trim();

//     const card = document.createElement('div');
//     card.className = 'model_m p-3 clearfix border rounded mb-3 col-md-6'; // two per row on md
//     card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.05)';
//     card.innerHTML = `
//       <div class="model_pg1i2 row">
//         <div class="col-md-6 col-sm-6">
//           <div class="model_pg1i2l">
//             <h4>${title}</h4>
//             <span class="font_12 col_yell">
//               <i class="fa fa-star"></i>
//               <i class="fa fa-star"></i>
//               <i class="fa fa-star"></i>
//               <i class="fa fa-star"></i>
//               <i class="fa fa-star-half-o"></i>
//             </span>
//           </div>
//         </div>
//         <div class="col-md-6 col-sm-6">
//           <div class="model_pg1i2r text-end">
//             <h3 class="mb-1"><i class="fa fa-rupee col_oran"></i> ${price}</h3>
//             <h6 class="mb-0 font_14">price</h6>
//           </div>
//         </div>
//       </div>
//       <div class="model_pg1i3 row mt-3 mb-3">
//         <div class="col-md-6 col-sm-6">
//           <div class="model_pg1i3l">
//             <h6><i class="fa fa-car col_oran me-1"></i> ${type}</h6>
//             <h6 class="mb-0 mt-2"><i class="fa fa-calendar col_oran me-1"></i> Model Year: ${modelYear}</h6>
//           </div>
//         </div>
//         <div class="col-md-6 col-sm-6">
//           <div class="model_pg1i3l text-end">
//             <h6><i class="fa fa-tachometer col_oran me-1"></i> Mileage: ${mileage}</h6>
//             <h6 class="mb-0 mt-2"><i class="fa fa-user col_oran me-1"></i> Owner: ${owner}</h6>
//           </div>
//         </div>
//       </div>
//       <hr>
//       <div class="model_pg1i4 row text-center mt-2">
//         <div class="col-md-12">
//           <p class="mb-1"><small>Reg No: ${reg}</small></p>
//           <h6 class="mb-0">
//             <a class="button" href="#">Book Ride <i class="fa fa-check-circle ms-1"></i></a>
//           </h6>
//         </div>
//       </div>
//     `;
//     return card;
//   }

//   function renderResults(matched) {
//     const container = document.getElementById('results');
//     if (!container) return;
//     container.innerHTML = ''; // clear previous

//     if (!matched || matched.length === 0) {
//       container.innerHTML = '<div class="alert alert-warning">No matching vehicles found.</div>';
//       return;
//     }

//     const row = document.createElement('div');
//     row.className = 'row g-3';
//     matched.forEach(v => {
//       const wrapper = document.createElement('div');
//       wrapper.className = 'col-12 col-lg-6'; // two per row on large, full on small
//       wrapper.appendChild(createVehicleCard(v));
//       row.appendChild(wrapper);
//     });
//     container.appendChild(row);
//   }

//   function searchVehicle() {
//     const location = normalizeSelect(document.getElementById('select-location'), /^Select\s+Location$/i);
//     const brand = normalizeSelect(document.getElementById('select-brand'), /^Select\s+Vehicle\s+Brand$/i);
//     const type = normalizeSelect(document.getElementById('select-type'), /^Seach\s+Type$/i).toLowerCase();
//     const model = normalizeSelect(document.getElementById('select-model'), /^Select\s+Model$/i);
//     const priceInput = (document.getElementById('price')?.value || '').trim();
//     const modelYearInput = (document.getElementById('modelYear')?.value || '').trim();
//     const mileageInput = (document.getElementById('mileage')?.value || '').trim();

//     if (!brand || !model) {
//       console.warn('Brand and model are required.');
//       renderResults([]);
//       return;
//     }

//     const enteredPrice = toNumber(priceInput);
//     const enteredModelYear = toNumber(modelYearInput);
//     const enteredMileage = toNumber(mileageInput);

//     const matched = vehiclesData.filter(v => {
//       if (!v.Brand || !v.modelName) return false;
//       if (v.Brand.toLowerCase() !== brand.toLowerCase()) return false;
//       if (v.modelName.toLowerCase() !== model.toLowerCase()) return false;
//       if (type && v.type && v.type.toLowerCase() !== type) return false;

//       if (enteredPrice != null) {
//         const vehPrice = toNumber(v.price);
//         if (vehPrice == null || !(vehPrice <= enteredPrice)) return false;
//       }
//       if (enteredModelYear != null) {
//         const vehYear = toNumber(v["Model Year"]);
//         if (vehYear == null || !(vehYear >= enteredModelYear)) return false;
//       }
//       if (enteredMileage != null) {
//         const vehMileage = toNumber(v.actualKms ?? v.correctedKms ?? '');
//         if (vehMileage == null || !(vehMileage >= enteredMileage)) return false;
//       }
//       return true;
//     });

//     renderResults(matched);
//   }