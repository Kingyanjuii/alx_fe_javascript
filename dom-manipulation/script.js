// Quotes array - load from localStorage if available
let quotes = [];
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
} else {
  // Default quotes if nothing in localStorage
  quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "You learn more from failure than from success.", category: "Learning" }
  ];
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const formContainer = document.createElement("div");
document.body.appendChild(formContainer);
const exportButton = document.createElement("button");
exportButton.textContent = "Export Quotes to JSON";
document.body.appendChild(exportButton);
const importFileInput = document.createElement("input");
importFileInput.type = "file";
importFileInput.accept = ".json";
importFileInput.id = "importFile";
document.body.appendChild(importFileInput);

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available. Add some!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Update the DOM
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.category}</strong>`;

  // Store last viewed quote in sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Function to create dynamic add quote form
function createAddQuoteForm() {
  formContainer.innerHTML = "";

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", function () {
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
      alert("Both quote text and category are required.");
      return;
    }

    // Add new quote and save to localStorage
    quotes.push({ text, category });
    saveQuotes();

    // Clear input fields
    textInput.value = "";
    categoryInput.value = "";

    // Show the newly added quote
    showRandomQuote();
  });

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Function to export quotes as JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error importing quotes: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize
createAddQuoteForm();
showRandomQuote();

// Event listeners
newQuoteButton.addEventListener("click", showRandomQuote);
exportButton.addEventListener("click", exportToJsonFile);
importFileInput.addEventListener("change", importFromJsonFile);
