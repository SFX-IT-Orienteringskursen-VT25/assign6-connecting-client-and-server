const API_URL = "http://localhost:5262/storage/numbers";

const numberForm = document.getElementById("number-form");
const numberInput = document.getElementById("number-input");
const totalSum = document.getElementById("total-sum");
const numberHistory = document.getElementById("number-history");
const clearButton = document.getElementById("clear-button");

let numbers = [];

function updateDisplay() {
  const sum = numbers.reduce((total, number) => total + number, 0);

  totalSum.textContent = sum;
  numberHistory.innerHTML = "";

  numbers.forEach((number) => {
    const listItem = document.createElement("li");
    listItem.textContent = number;
    numberHistory.appendChild(listItem);
  });
}

async function saveNumbers() {
  const response = await fetch("http://localhost:5262/storage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: "numbers",
      value: JSON.stringify(numbers),
    }),
  });

  if (!response.ok) {
    throw new Error("Could not save numbers");
  }
}

async function loadNumbers() {
  try {
    const response = await fetch(API_URL);

    if (response.status === 404) {
      numbers = [];
    } else if (response.ok) {
      const data = await response.json();
      numbers = JSON.parse(data.value);
    } else {
      throw new Error("Could not load numbers");
    }

    updateDisplay();
  } catch (error) {
    console.error("Error loading numbers:", error);
    alert("Could not load numbers from the server.");
  }
}

numberForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const number = Number(numberInput.value);

  if (numberInput.value.trim() === "" || !Number.isFinite(number)) {
    return;
  }

  numbers.push(number);

  try {
    await saveNumbers();
    updateDisplay();
    numberInput.value = "";
    numberInput.focus();
  } catch (error) {
    numbers.pop();
    console.error("Error saving numbers:", error);
    alert("Could not save the number. Please try again.");
  }
});

clearButton.addEventListener("click", async () => {
  const previousNumbers = [...numbers];
  numbers = [];

  try {
    await saveNumbers();
    updateDisplay();
  } catch (error) {
    numbers = previousNumbers;
    updateDisplay();
    console.error("Error clearing numbers:", error);
    alert("Could not clear numbers. Please try again.");
  }
});

loadNumbers();
