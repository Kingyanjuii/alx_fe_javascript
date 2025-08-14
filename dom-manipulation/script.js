// Quotes array
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You learn more from failure than from success.", category: "Learning" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const addQuoteButton = document.getElementById("addQuoteBtn");

// Function to display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.category}</strong>`;
}

// Function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both quote text and category are required.");
    return;
  }

  quotes.push({ text, category });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Display the newly added quote
  displayRandomQuote();
}

// Event listeners
newQuoteButton.addEventListener("click", displayRandomQuote);
addQuoteButton.addEventListener("click", addQuote);
