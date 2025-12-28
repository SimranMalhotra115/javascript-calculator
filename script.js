const display = document.getElementById("display");
const keys = document.querySelector(".keys");

let current = "0";
let operator = null;
let previous = null;

function update() {
  display.textContent = current;
}

keys.addEventListener("click", (e) => {
  const key = e.target.dataset.key;
  if (!key) return;

  if (!isNaN(key) || key === ".") {
    if (current === "0" && key !== ".") current = key;
    else current += key;
  } else if (["+", "-", "*", "/"].includes(key)) {
    operator = key;
    previous = parseFloat(current);
    current = "0";
  } else if (key === "=") {
    if (operator && previous !== null) {
      const b = parseFloat(current);
      switch (operator) {
        case "+": current = String(previous + b); break;
        case "-": current = String(previous - b); break;
        case "*": current = String(previous * b); break;
        case "/": current = b === 0 ? "Error" : String(previous / b); break;
      }
      operator = null;
      previous = null;
    }
  } else if (key === "C") {
    current = "0";
    operator = null;
    previous = null;
  }
  update();
});

update();
