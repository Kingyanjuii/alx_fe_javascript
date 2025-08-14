// Quotes array with text and category properties
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You learn more from failure than from success.", category: "Learning" }
];

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteButton = document.getElementById('addQuoteBtn');

// Function to display a random quote
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available. Add some!";
    return;
  }

  // Select a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Update the DOM
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.category}</strong>`;
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Both quote text and category are required.");
    return;
  }

  // Add the new quote to the array
  quotes.push({ text: text, category: category });

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";

  // Update the DOM to show the new quote
  displayRandomQuote();
}

// Attach event listeners
newQuoteButton.addEventListener('click', displayRandomQuote);
addQuoteButton.addEventListener('click', addQuote);
