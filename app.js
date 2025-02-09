// Create onload handler
window.addEventListener("load", main);

// Create main function
function main() {
  // Select the dom elements
  const changeBtn = getElementByIdError("change-btn");
  const root = getElementByIdError("root");
  const hexOutput = getElementByIdError("hexOutput");
  const rgbOutput = getElementByIdError("rgbOutput");
  const hexCopy = getElementByIdError("hexCopy");
  const rgbCopy = getElementByIdError("rgbCopy");
  const toast = getElementByIdError("toast");
  const progressBar = getElementByIdError("progress-bar");
  const closeBtn = getElementByIdError("cross-btn");
  const copiedText = getElementByIdError("copied-text");

  // Change the colors
  changeBtn.addEventListener("click", function () {
    const colors = randomDecimalNumber();
    root.style.backgroundColor = colors.hex;

    // Show the hexValue
    hexOutput.value = colors.hex.substring(1).toUpperCase();

    // Show RGB value
    rgbOutput.value = colors.rgb;
  });

  // Reuseable function for handdle user color input
  function syncColorInput(inputType, value) {
    if (inputType === "hex" && value.length === 6 && isValid(`#${value}`)) {
      const rgbFromHex = hexToRgb(value);
      rgbOutput.value = rgbFromHex;
      root.style.backgroundColor = `#${value}`;
    } else if (inputType === "rgb" && value.length >= 5) {
      const hexFromRgb = rgbToHex(value);
      hexOutput.value = hexFromRgb;
      root.style.backgroundColor = `#${hexFromRgb}`;
    }
  }
  // Handdle the hexOutput user input
  hexOutput.addEventListener("keyup", function (e) {
    syncColorInput("hex", e.target.value);
  });

  // Handdle the rgb user input
  rgbOutput.addEventListener("keyup", function (e) {
    syncColorInput("rgb", e.target.value);
  });

  // Reuseable function for handdle copy to clipboard
  function copyToClipboard(value, format) {
    if (!value) return alert("Invalid color code!");

    window.navigator.clipboard.writeText(
      format === "hex" ? `#${value}` : `rgb(${value})`
    );
    copiedText.textContent = format === "hex" ? `#${value}` : `rgb(${value})`;

    // Show toast notification
    toast.classList.add("active");
    progressBar.classList.add("active");

    setTimeout(() => {
      toast.classList.remove("active");
      progressBar.classList.remove("active");
    }, 3000);
  }

  hexCopy.addEventListener("click", () =>
    copyToClipboard(hexOutput.value, "hex")
  );
  rgbCopy.addEventListener("click", () =>
    copyToClipboard(rgbOutput.value, "rgb")
  );

  // Close the toast close icon click
  closeBtn.addEventListener("click", function () {
    toast.classList.remove("active");
  });
}

// Create a getElementById function to handdle the dom error
function getElementByIdError(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Error: Element with id '${id}' not found`);
    return;
  }
  return element;
}

// Generate the colors
function randomDecimalNumber() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  return {
    hex: `#${red.toString(16).padStart(2, "0")}${green
      .toString(16)
      .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`,
    rgb: `${red}, ${green}, ${blue}`,
  };
}

// Step 7 - HEX to Rgb function
function hexToRgb(colorCode) {
  const twoRedCode = colorCode.slice(0, 2);
  const twoGreenCode = colorCode.slice(2, 4);
  const twoBlueCode = colorCode.slice(4);

  return `${parseInt(twoRedCode, 16)} , ${parseInt(
    twoGreenCode,
    16
  )}, ${parseInt(twoBlueCode, 16)}`;
}

// Step 8 - RGB to Hex function
function rgbToHex(colorCode) {
  const codeArr = colorCode.split(",").map((num) => parseInt(num.trim(), 10));

  const redCode = codeArr[0].toString(16).padStart(2, "0");
  const greenCode = codeArr[1].toString(16).padStart(2, "0");
  const blueCode = codeArr[2].toString(16).padStart(2, "0");

  return `${redCode}${greenCode}${blueCode}`;
}

// Create a validate function to validate the user color code
function isValid(color) {
  if (color.length !== 7) return false;
  if (color[0] !== "#") return false;

  color = color.substring(1);
  return /^[0-9A-Fa-f]{6}$/i.test(color);
}
