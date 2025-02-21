/**
 * Date: 12-02-20025
 * Author: Ahmeds sohel
 * Description: The Dynamic Color Generator is a lightweight and interactive web application that allows users to generate random colors in both **Hex** and **RGB** formats, copy the color codes to their clipboard with a seamless user experience. The project is built using vanilla JavaScript, ensuring smooth performance without dependencies.
 */

//-------------------------        -       -------------------------------------------------
//                       ------ Globals ------
// ------------------------        -       -------------------------------------------------

window.addEventListener("load", function () {
  main();
  // Defalut Color
  const defaultColor = randomDecimalNumber();
  updateColorsToDom(defaultColor);
  renderColorPresets(presetColors, getElementByIdError("preset-container"));
  renderColorPresets(
    JSON.parse(localStorage.getItem("savedCustomColors")),
    getElementByIdError("custom-container")
  );
});
let toastTimeout;

// Preset color array
const presetColors = [
  "#FF5733",
  "#FF6F61",
  "#FF8C94",
  "#FFB3BA",
  "#FFC300",
  "#FFD700",
  "#FFE066",
  "#FFF7AE",
  "#3498DB",
  "#5DADE2",
  "#85C1E9",
  "#D4E6F1",
  "#9B59B6",
  "#AF7AC5",
  "#C39BD3",
  "#E8DAEF",
  "#27AE60",
  "#52BE80",
  "#7DCEA0",
  "#A9DFBF",
  "#EC7063",
  "#F1948A",
  "#F5B7B1",
  "#FADBD8",
];

//-------------------------        -       -------------------------------------------------
//            ------ Main Function will Handdle DOM Events ------
// ------------------------         -      -------------------------------------------------

function main() {
  // DOM References
  const generateColorBtn = getElementByIdError("generate-color-btn");
  const userHexInput = getElementByIdError("hex-user-input");
  // const userRgbInput = getElementByIdError("rgb-user-input");
  const redRangeValue = getElementByIdError("rgb-red-range");
  const greenRangeValue = getElementByIdError("rgb-green-range");
  const blueRangeValue = getElementByIdError("rgb-blue-range");
  const colorPresetParent = getElementByIdError("preset-container");
  const customColorParent = getElementByIdError("custom-container");
  const copyBtn = getElementByIdError("copy-btn");
  const saveBtn = getElementByIdError("save-btn");

  // DOM Events Operation
  generateColorBtn.addEventListener("click", updateColors);
  userHexInput.addEventListener("keyup", syncColorInput);

  const updateColorOnDom = updateColorOnSliderChange(
    redRangeValue,
    greenRangeValue,
    blueRangeValue
  );
  const inputElementArray = [redRangeValue, greenRangeValue, blueRangeValue];
  inputElementArray.forEach(function (input) {
    input.addEventListener("input", updateColorOnDom);
  });
  copyBtn.addEventListener("click", handdleInputCopy);
  saveBtn.addEventListener("click", saveColorsToLocalStorage);
  colorPresetParent.addEventListener("click", handdlePresetsCopy);
  customColorParent.addEventListener("click", handdlePresetsCopy);
}

//-------------------------        -       -------------------------------------------------
//                      ------ Event Handdler ------
// ------------------------        -       -------------------------------------------------

function updateColors() {
  const colors = randomDecimalNumber();
  updateColorsToDom(colors);
}

function syncColorInput() {
  const hexValue = this.value;
  if(hexValue.length !== 6) return showToast("error", null);
  if (isValid(`#${hexValue}`)) {
    const userInputValue = hexToRgb(hexValue);
    updateColorsToDom(userInputValue);
    this.value = hexValue.toUpperCase();
    getElementByIdError("toast").classList.remove("active", "success", "error");
  }
}

function updateColorOnSliderChange(
  redRangeValue,
  greenRangeValue,
  blueRangeValue
) {
  return function () {
    const color = {
      red: parseInt(redRangeValue.value),
      green: parseInt(greenRangeValue.value),
      blue: parseInt(blueRangeValue.value),
    };
    updateColorsToDom(color);
  };
}

function handdleInputCopy() {
  const getAllRadioInput = document.getElementsByName("color-mode");
  const hexValue = getElementByIdError("hex-user-input").value;
  const copyMode = getCheckedRadioValue(getAllRadioInput);

  if (copyMode === "hex-mode") {
    if (hexValue && isValid(`#${hexValue}`)) {
      copyToClipboard(`#${hexValue}`);
    } else {
      showToast("error", null)
      return;
    }
  } else if (copyMode === "rgb-mode") {
    const rgbValue = getElementByIdError("rgb-user-input").value;
    if (rgbValue && isValid(`#${hexValue}`)) {
      copyToClipboard(rgbValue);
    } else {
      showToast("error", null);
      return;
    }
  } else {
    alert("Invalid Mode!");
    return;
  }
}

function handdlePresetsCopy(event) {
  const colorBox = event.target;
  const getAllRadioInput = document.getElementsByName("color-mode");
  const checkedMode = getCheckedRadioValue(getAllRadioInput);

  if (colorBox.classList.contains("color-box")) {
    const colorValue = colorBox.getAttribute("data-color");
    const getRgbObj = hexToRgb(colorValue.substring(1));
    const rgbValue = `rgb(${getRgbObj.red},${getRgbObj.green},${getRgbObj.blue})`;

    if (checkedMode === "hex-mode") {
      copyToClipboard(colorValue);
      notificationSound();
    } else if (checkedMode === "rgb-mode" && rgbValue) {
      copyToClipboard(rgbValue);
      notificationSound();
    } else {
      alert("Invalid Mode!");
    }
  }
}

function saveColorsToLocalStorage() {
  addCustomColorToLocalStorage(
    `#${getElementByIdError("hex-user-input").value}`
  );
  const colorFromLocalStorage = getCustomColorFromLocalStorage();
  renderColorPresets(
    colorFromLocalStorage,
    getElementByIdError("custom-container")
  );
}

//-------------------------        -       -------------------------------------------------
//                      ------ DOM Operations ------
// ------------------------        -       -------------------------------------------------

/**
 * Update The Colors To The DOM
 * @param {object} colors
 */

function updateColorsToDom(rgbColor) {
  const hex = rgbToHex(rgbColor);
  const rgbObj = rgbColor;

  getElementByIdError(
    "display-color"
  ).style.backgroundColor = `rgb(${rgbObj.red}, ${rgbObj.green}, ${rgbObj.blue})`;
  getElementByIdError("hex-user-input").value = hex.toUpperCase();
  getElementByIdError(
    "rgb-user-input"
  ).value = `rgb(${rgbObj.red}, ${rgbObj.green}, ${rgbObj.blue})`;
  getElementByIdError("rgb-red-value").textContent = rgbObj.red;
  getElementByIdError("rgb-green-value").textContent = rgbObj.green;
  getElementByIdError("rgb-blue-value").textContent = rgbObj.blue;
  getElementByIdError("rgb-red-range").value = rgbObj.red;
  getElementByIdError("rgb-green-range").value = rgbObj.green;
  getElementByIdError("rgb-blue-range").value = rgbObj.blue;
}

/**
 * Get the Elemenet by ID With Handdle Error
 * @param {string} HTML Element
 * @returns {Boolean}
 */

function getElementByIdError(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Element with id '${id}' not found.`);
  return element;
}

/**
 * Generate dynamic HTML for Preset
 * @param {string}
 * @returns {object}
 */

function createPreset(color) {
  const colorBox = document.createElement("div");
  colorBox.className = "color-box";
  colorBox.setAttribute("data-color", color);
  colorBox.style.backgroundColor = color;

  return colorBox;
}

/**
 * Render The HTML Into DOM
 * @param {Array} colors
 * @param {HTMLElement} parentNode
 */

function renderColorPresets(colors, parentNode) {
  const fragment = document.createDocumentFragment();
  parentNode.innerHTML = "";
  colors.forEach(function (color) {
    const getElement = createPreset(color);
    fragment.appendChild(getElement);
  });
  parentNode.appendChild(fragment);
}
/**
 * Copy The Value To The Clipboard
 * @param {string}
 */

async function copyToClipboard(colorValue) {
  try {
    await window.navigator.clipboard.writeText(colorValue);
    showToast("success", colorValue);
  } catch (error) {
    showToast("error", colorValue);
  }
  window.navigator.clipboard.writeText(colorValue);
}

/**
 * Toast Modal For Diffrent Purpose
 * @param {string} type
 * @param {string} message
 */

function showToast(type = "success", copiedColor) {
  const toast = getElementByIdError("toast");
  const toastMessage = getElementByIdError("toast-message");
  const toastIcon = getElementByIdError("toast-icon");

  toast.classList.remove("error", "success")

  if (type === "error") {
    toastMessage.innerHTML = "Invalid color!";
    toastIcon.innerHTML = "&#10006;";
    toast.classList.add("active", "error");
  }
  else {
    toastMessage.innerHTML = `Color <span class="copied-text">${copiedColor}</span> has been copied to clipboard`;
    toast.classList.add("active", "success");
  }

  // Clear previous timeout before setting a new one
  clearTimeout(toastTimeout);

  // Remove active class after 3 seconds
  toastTimeout = setTimeout(() => {
    toast.classList.remove("active", "error", "success");
  }, 3000);
}

//-------------------------        -       -------------------------------------------------
//                      ------ Utils Functions ------
// ------------------------        -       -------------------------------------------------

/**
 * This function play a notification sound
 */

function notificationSound() {
  const sound = new Audio("./assets/notification.mp3");
  sound.play();
}

/**
 * Generate Radmon Decimal Values
 * Return as Object with two value[Hex][RGB]
 * @returns {object}
 */

function randomDecimalNumber() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  return {
    red,
    green,
    blue,
  };
}

/**
 * Convert HEX to RGB
 * @param {string} colorCode
 * @returns {object}
 */

function hexToRgb(hexCode) {
  const twoRedCode = hexCode.slice(0, 2);
  const twoGreenCode = hexCode.slice(2, 4);
  const twoBlueCode = hexCode.slice(4);

  return {
    red: `${parseInt(twoRedCode, 16)}`,
    green: `${parseInt(twoGreenCode, 16)}`,
    blue: `${parseInt(twoBlueCode, 16)}`,
  };
}

/**
 * Convert RGB to HEX
 * @param {string} colorCode
 * @returns {string}
 */

function rgbToHex(rgbCode) {
  const rgb = rgbCode;

  const redCode = rgb.red.toString(16).padStart(2, "0");
  const greenCode = rgb.green.toString(16).padStart(2, "0");
  const blueCode = rgb.blue.toString(16).padStart(2, "0");

  return `${redCode}${greenCode}${blueCode}`;
}

/**
 * Validate The User Hex Input
 * @param {string} color
 * @returns {Boolean}
 */

function isValid(color) {
  if (color.length !== 7) return false;
  if (color[0] !== "#") return false;

  color = color.substring(1);
  return /^[0-9A-Fa-f]{6}$/i.test(color);
}

/**
 * Get The Current Checked Value From The Radios
 * @param {Array} nodes
 * @returns {string}
 */

function getCheckedRadioValue(nodes) {
  let checked = null;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].checked) {
      checked = nodes[i].value;
      break;
    }
  }
  return checked;
}

/**
 * Save the custom colors into the localStorage
 * @param {string} color
 * @returns {Array}
 */

function addCustomColorToLocalStorage(color) {
  if(!isValid(color)) return;

  let colors = JSON.parse(localStorage.getItem("savedCustomColors")) || [];
  if (colors.includes(color)) return alert("Color Already Added");
  if (colors.length > 23) {
    colors.shift();
  }
  colors.unshift(color);
  localStorage.setItem("savedCustomColors", JSON.stringify(colors));
}

/**
 * Get the custom saved color from localStorage
 * @returns {Array}
 */

function getCustomColorFromLocalStorage() {
  return JSON.parse(localStorage.getItem("savedCustomColors")) || [];
}
