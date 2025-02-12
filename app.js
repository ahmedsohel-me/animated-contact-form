/**
 * Date: 12-02-20025
 * Author: Ahmeds sohel
 * Description: The Dynamic Color Generator is a lightweight and interactive web application that allows users to generate random colors in both **Hex** and **RGB** formats, copy the color codes to their clipboard with a seamless user experience. The project is built using vanilla JavaScript, ensuring smooth performance without dependencies.
 */

// Globals
window.addEventListener("load", main);
let toastTimeout;

/**
 * Main Function will Handdle DOM Events
 */

function main() {
  // Defalut Color
  const defaultColor = randomDecimalNumber();
  updateColorsToDom(defaultColor);

  // DOM References
  const generateColorBtn = getElementByIdError("generate-color-btn");
  const userHexInput = getElementByIdError("hex-user-input");
  const userRgbInput = getElementByIdError("rgb-user-input");
  const redRangeValue = getElementByIdError("rgb-red-range");
  const greenRangeValue = getElementByIdError("rgb-green-range");
  const blueRangeValue = getElementByIdError("rgb-blue-range");
  const copyBtn = getElementByIdError("copy-btn");

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
  copyBtn.addEventListener("click", handdleCopy);
}

// Event Handdler

function updateColors() {
  const colors = randomDecimalNumber();
  updateColorsToDom(colors);
}

function syncColorInput() {
  const hexValue = this.value;
  if (isValid(`#${hexValue}`)) {
    const userInputValue = hexToRgb(hexValue);
    updateColorsToDom(userInputValue);
    this.value = hexValue.toUpperCase();
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

function handdleCopy() {
  const getAllRadioInput = document.getElementsByName("color-mode");
  const copyMode = getCheckedRadioValue(getAllRadioInput);
  const toast = getElementByIdError("toast");
  const copiedText = getElementByIdError("copied-text");

  if (copyMode === "hex-mode") {
    const hexValue = getElementByIdError("hex-user-input").value;
    if (hexValue && isValid(`#${hexValue}`)) {
      window.navigator.clipboard.writeText(`#${hexValue}`);
      copiedText.textContent = `#${hexValue}`;
      toast.classList.add("active");
    } else {
      alert("Invalid Hex Color!");
      return;
    }
  } else if (copyMode === "rgb-mode") {
    const rgbValue = getElementByIdError("rgb-user-input").value;

    if (rgbValue) {
      window.navigator.clipboard.writeText(rgbValue);
      copiedText.textContent = rgbValue;
      toast.classList.add("active");
    } else {
      alert("Invalid RGB Color!");
      return;
    }
  } else {
    alert("Invalid Mode!");
    return;
  }

  // Clear previous timeout before setting a new one
  clearTimeout(toastTimeout);

  // Remove active class after 3 seconds
  toastTimeout = setTimeout(() => {
    toast.classList.remove("active");
  }, 3000);
}

// DOM Operations

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
  if (!element) {
    console.error(`Error: Element with id '${id}' not found`);
    return;
  }
  return element;
}

// Utils Functions

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
