// Quotes array - load from localStorage if available
let quotes = [];
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
} else {
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
const addQuoteButton = document.getElementById("addQuoteBtn");
const exportButton = document.getElementById("exportButton");
const importFileInput = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote (respects current category filter)
function showRandomQuote() {
  let selectedCategory = categoryFilter.value || "all";
  let filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.category}</strong>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Populate category dropdown dynamically
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastCategory = localStorage.getItem("lastCategoryFilter") || "all";
  categoryFilter.value = lastCategory;
  showRandomQuote();
}

// Filter quotes when category changes
function filterQuotes() {
  localStorage.setItem("lastCategoryFilter", categoryFilter.value);
  showRandomQuote();
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both quote text and category are required.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories(); // Update categories dropdown

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  filterQuotes();
}

// Export quotes as JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      populateCategories();
    } catch (err) {
      alert("Error importing quotes: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize
populateCategories();

// Event listeners
newQuoteButton.addEventListener("click", showRandomQuote);
addQuoteButton.addEventListener("click", addQuote);
exportButton.addEventListener("click", exportToJsonFile);
importFileInput.addEventListener("change", importFromJsonFile);
categoryFilter.addEventListener("change", filterQuotes);

// Simulated server URL (mock API)
const serverUrl = "https://jsonplaceholder.typicode.com/posts";

// Function to fetch data from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const data = await response.json();

    // Map server data to quote format: text & category
    const serverQuotes = data.slice(0, 10).map(item => ({
      text: item.title,
      category: "Server"
    }));

    // Conflict resolution: server takes precedence
    let updated = false;
    serverQuotes.forEach(sq => {
      if (!quotes.some(q => q.text === sq.text && q.category === sq.category)) {
        quotes.push(sq);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      alert("Quotes have been synced with the server!");
    }

  } catch (err) {
    console.error("Error fetching server quotes:", err);
  }
}

// Periodically sync with server every 60 seconds
setInterval(fetchQuotesFromServer, 60000);

// Optional: manual sync button
const syncButton = document.createElement("button");
syncButton.textContent = "Sync with Server";
document.body.appendChild(syncButton);
syncButton.addEventListener("click", fetchQuotesFromServer);
