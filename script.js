// 1. Zustandsspeicher (State Variables)
let currentOperand = "0";
let previousOperand = "";
let operation = null;
let shouldResetScreen = false;

// DOM-Elemente
const currentOperandElement = document.getElementById("current-operand");
const previousOperandElement = document.getElementById("previous-operand");
const numberButtons = document.querySelectorAll(".btn-number");
const operatorButtons = document.querySelectorAll(".btn-operator");
const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");
const deleteButton = document.getElementById("delete");

// 2. Mathematische Grundfunktionen
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
  if (b === 0) return "Error";
  return a / b;
}

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case "+": return add(a, b);
    case "-": return subtract(a, b);
    case "*": return multiply(a, b);
    case "/": return divide(a, b);
    default: return null;
  }
}

// 3. Logik-Funktionen zur Zustandssteuerung
function clear() {
  currentOperand = "0";
  previousOperand = "";
  operation = null;
  shouldResetScreen = false;
  updateDisplay();
}

function deleteNumber() {
  if (shouldResetScreen) return;
  if (currentOperand === "Error") {
    clear();
    return;
  }
  currentOperand = currentOperand.toString().slice(0, -1);
  if (currentOperand === "" || currentOperand === "-") {
    currentOperand = "0";
  }
  updateDisplay();
}

function appendNumber(number) {
  if (currentOperand === "Error") clear();
  if (number === "." && currentOperand.includes(".")) return;
  if (currentOperand === "0" && number !== ".") {
    currentOperand = number;
  } else if (shouldResetScreen) {
    currentOperand = number;
    shouldResetScreen = false;
  } else {
    currentOperand += number;
  }
  updateDisplay();
}

function chooseOperation(selectedOperator) {
  if (currentOperand === "Error") return;
  if (operation !== null && !shouldResetScreen) {
    compute();
  }
  operation = selectedOperator;
  previousOperand = currentOperand;
  shouldResetScreen = true;
  updateDisplay();
}

function compute() {
  if (operation === null || shouldResetScreen) return;
  if (operation === "/" && currentOperand === "0") {
    currentOperand = "Error";
    previousOperand = "";
    operation = null;
    shouldResetScreen = true;
    updateDisplay();
    return;
  }

  let result = operate(operation, previousOperand, currentOperand);
  if (typeof result === "number") {
    // Runden auf max. 8 Nachkommastellen zur Vermeidung von Fließkommafehlern
    result = Math.round(result * 100000000) / 100000000;
  }
  currentOperand = result.toString();
  operation = null;
  previousOperand = "";
  shouldResetScreen = true;
  updateDisplay();
}

function updateDisplay() {
  currentOperandElement.textContent = currentOperand;
  if (operation !== null) {
    let symbol = operation;
    if (operation === "*") symbol = "×";
    if (operation === "/") symbol = "÷";
    previousOperandElement.textContent = `${previousOperand} ${symbol}`;
  } else {
    previousOperandElement.textContent = "";
  }
}

// 4. Event-Listener an die Tasten binden
numberButtons.forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.textContent));
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const op = button.getAttribute("data-operator");
    chooseOperation(op);
  });
});

equalsButton.addEventListener("click", compute);
clearButton.addEventListener("click", clear);
deleteButton.addEventListener("click", deleteNumber);