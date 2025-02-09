// Step -1 Create onload handler
window.addEventListener("load", main);

// Step 2 - Create main function
function main() {
  // Select the dom elements
  const changeBtn = getElementByIdError("change-btn");
  const root = getElementByIdError("root");
  const output = getElementByIdError("output");
  const copyBtn = getElementByIdError("copy");
  const toast = getElementByIdError("toast");
  const progressBar = getElementByIdError("progress-bar");
  const closeBtn = getElementByIdError("cross-btn");
  const copiedText = getElementByIdError("copied-text");

  // Change the colors
  changeBtn.addEventListener("click", function () {
    // Chnage the bg colors
    const bgColor = randomHexColor();
    root.style.backgroundColor = bgColor;

    // Show the hexValue
    output.value = bgColor.substring(1);
  });

  // Handdle the user input
  output.addEventListener("keyup", function (e) {
    const color = `#${e.target.value}`;
    if (color && isValidHex(color)) {
      root.style.backgroundColor = color;
    }
  });
  // Copy to the clipboard
  copyBtn.addEventListener("click", function () {
    if (isValidHex(`#${output.value}`)) {
      window.navigator.clipboard.writeText(output.value);
      copiedText.textContent = `#${output.value}`;

      // Toast message
      toast.classList.add("active");
      progressBar.classList.add("active");

      setTimeout(() => {
        toast.classList.remove("active");
        progressBar.classList.remove("active");
      }, 3000);
    } else {
      alert("Invalid color code!")
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

// Step 4 - Random color generator function
function randomHexColor() {
  // Generate random hex colors
  const red = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const green = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const blue = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");

  return `#${red}${green}${blue}`;
}

// Create a validate function to validate the user color code
function isValidHex(color) {
  if (color.length !== 7) return false;
  if (color[0] !== "#") return false;

  color = color.substring(1);
  return /^[0-9A-Fa-f]{6}$/i.test(color);
}
