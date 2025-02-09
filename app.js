// Step -1 Create onload handler
window.addEventListener("load", main);

// Step 2 - Create main function
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
    // Chnage the bg colors
    const bgColor = randomHexColor(colors);
    root.style.backgroundColor = bgColor;

    // Show the hexValue
    hexOutput.value = bgColor.substring(1).toUpperCase();

    // Show RGB value
    const rgbColor = randomRgbColor(colors);
    rgbOutput.value = rgbColor;
  });

  // Handdle the hexOutput user input
  hexOutput.addEventListener("keyup", function (e) {
    // Change the rgb color when user type on hex output field 
    const hexColorCode = e.target.value;
    if(hexColorCode.length === 6){
      const rgbFromHex = hexToRgb(hexColorCode)
      rgbOutput.value = rgbFromHex;
    }

    const color = `#${e.target.value}`;
    if (color && isValid(color)) {
      root.style.backgroundColor = color;
      const rgbColor = randomRgbColor();
      rgbOutput.value = rgbColor;
      
    }
  });

  // Handdle the rgb user input 

  rgbOutput.addEventListener("keyup", function(e) {

    const userTypiedCode = e.target.value;

    if(userTypiedCode.length > 4 && !isNaN(parseInt(userTypiedCode))){
      const hexFromRgb = rgbToHex(e.target.value);
      console.log(hexFromRgb);
      
      hexOutput.value = hexFromRgb;
      root.style.backgroundColor = `#${hexFromRgb}`;
    }
  })

  // Hex Copy to the clipboard
  hexCopy.addEventListener("click", function () {
    if (isValid(`#${hexOutput.value}`)) {
      window.navigator.clipboard.writeText(hexOutput.value);
      copiedText.textContent = `#${hexOutput.value}`.toUpperCase();

      // Toast message
      toast.classList.add("active");
      progressBar.classList.add("active");

      setTimeout(() => {
        toast.classList.remove("active");
        progressBar.classList.remove("active");
      }, 3000);
    } else {
      alert("Invalid color code!");
    }
  });
  // RGB Copy to the clipboard
  rgbCopy.addEventListener("click", function () {

    if(rgbOutput.value.length >= 5 && rgbOutput.value.length <= 13 && !isNaN(parseInt(rgbOutput.value))) {
      window.navigator.clipboard.writeText(`rgb(${rgbOutput.value})`);
      copiedText.textContent = `rgb(${rgbOutput.value})`;

      // Toast message
      toast.classList.add("active");
      progressBar.classList.add("active");

      setTimeout(() => {
        toast.classList.remove("active");
        progressBar.classList.remove("active");
      }, 3000);
    } else {
      alert("Invaild input!")
    }
    
  });

  closeBtn.addEventListener("click", function () {
    toast.classList.remove("active");
  });
}

// Step 3 - Create a getElementById function to handdle the dom error
function getElementByIdError(id) {
  const element = document.getElementById(id);
  // If element not fond throw an error
  if (!element) {
    console.error(`Error: Element with id '${id}' not found`);
    return null;
  }
  // If there is no error return the element
  return element;
}

// Step 4 - Random hex color generator function
function randomHexColor({ red, green, blue }) {
  // Generate random hex colors
  return `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
}

// Step 5 - Random Rgb color generator function
function randomRgbColor({ red, green, blue }) {
  return `${red}, ${green}, ${blue}`;
}

// Step 6 - Generate random decimal number & assign it to an object to generate color code
function randomDecimalNumber() {
  // Generate random hex colors
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  return {
    red,
    green,
    blue,
  };
}

// Step 7 - HEX to Rgb function
function hexToRgb(colorCode) {
  const twoRedCode = colorCode.slice(0, 2);
  const twoGreenCode = colorCode.slice(2, 4);
  const twoBlueCode = colorCode.slice(4);

  return `${parseInt(twoRedCode, 16)} , ${parseInt(twoGreenCode, 16)}, ${parseInt(twoBlueCode, 16)}`;
}

// Step 8 - RGB to Hex function 
function rgbToHex(colorCode) {
    const codeArr = colorCode.split(",").map(num => parseInt(num.trim(), 10)); 

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
