const form = document.querySelector('#converter-form');
const latitudeInput = document.querySelector('#latitude');
const longitudeInput = document.querySelector('#longitude');
const latitudeResult = document.querySelector('#latitude-result');
const longitudeResult = document.querySelector('#longitude-result');
const combinedResult = document.querySelector('#combined-result');
const latitudeError = document.querySelector('#latitude-error');
const longitudeError = document.querySelector('#longitude-error');
const copyLatitude = document.querySelector('#copy-latitude');
const copyLongitude = document.querySelector('#copy-longitude');
const copyAll = document.querySelector('#copy-all');
const clearButton = document.querySelector('#clear-button');
const copyStatus = document.querySelector('#copy-status');

let currentLatitude = '';
let currentLongitude = '';

function convertDecimal(value, positiveDirection, negativeDirection) {
  const absolute = Math.abs(value);
  let degrees = Math.floor(absolute);
  let minutes = Math.round((absolute - degrees) * 60);

  // Whole-minute output. Carry 60 minutes into the next degree.
  if (minutes >= 60) {
    degrees += 1;
    minutes = 0;
  }

  const direction = value >= 0 ? positiveDirection : negativeDirection;
  return `${degrees}${String(minutes).padStart(2, '0')}${direction}`;
}

function validate(input, min, max, errorElement, label) {
  const raw = input.value.trim();
  input.classList.remove('invalid');
  errorElement.textContent = '';

  if (raw === '') {
    input.classList.add('invalid');
    errorElement.textContent = `${label} is required.`;
    return null;
  }

  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) {
    input.classList.add('invalid');
    errorElement.textContent = `${label} must be between ${min} and ${max}.`;
    return null;
  }
  return value;
}

function setCopyState(enabled) {
  copyLatitude.disabled = !enabled;
  copyLongitude.disabled = !enabled;
  copyAll.disabled = !enabled;
}

function runConversion() {
  copyStatus.textContent = '';
  const latitude = validate(latitudeInput, -90, 90, latitudeError, 'Latitude');
  const longitude = validate(longitudeInput, -180, 180, longitudeError, 'Longitude');

  if (latitude === null || longitude === null) {
    latitudeResult.textContent = '—';
    longitudeResult.textContent = '—';
    combinedResult.textContent = '—';
    currentLatitude = '';
    currentLongitude = '';
    setCopyState(false);
    return;
  }

  currentLatitude = convertDecimal(latitude, 'N', 'S');
  currentLongitude = convertDecimal(longitude, 'E', 'W');
  latitudeResult.textContent = currentLatitude;
  longitudeResult.textContent = currentLongitude;
  combinedResult.textContent = `${currentLatitude} ${currentLongitude}`;
  setCopyState(true);
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = message;
  } catch {
    copyStatus.textContent = 'Copy was blocked by the browser. Select the result and copy it manually.';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  runConversion();
});

[latitudeInput, longitudeInput].forEach((input) => {
  input.addEventListener('input', () => {
    if (latitudeInput.value.trim() && longitudeInput.value.trim()) runConversion();
  });
});

clearButton.addEventListener('click', () => {
  form.reset();
  latitudeResult.textContent = '—';
  longitudeResult.textContent = '—';
  combinedResult.textContent = '—';
  latitudeError.textContent = '';
  longitudeError.textContent = '';
  latitudeInput.classList.remove('invalid');
  longitudeInput.classList.remove('invalid');
  currentLatitude = '';
  currentLongitude = '';
  copyStatus.textContent = '';
  setCopyState(false);
  latitudeInput.focus();
});

copyLatitude.addEventListener('click', () => copyText(currentLatitude, 'Latitude copied.'));
copyLongitude.addEventListener('click', () => copyText(currentLongitude, 'Longitude copied.'));
copyAll.addEventListener('click', () => copyText(`${currentLatitude} ${currentLongitude}`, 'Both coordinates copied.'));
