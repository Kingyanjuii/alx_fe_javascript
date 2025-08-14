let quotes = [
    "The best way to get started is to quit talking and begin doing.",
    "Don't let yesterday take up too much of today.",
    "It's not whether you get knocked down, it's whether you get up."
];

// Function to select a random quote and update the DOM
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.textContent = quotes[randomIndex];
}

// Function to add a new quote to the quotes array and update the DOM
function addQuote() {
    const newQuoteInput = document.getElementById("newQuote");
    const newQuote = newQuoteInput.value.trim();
    if (newQuote) {
        quotes.push(newQuote);
        newQuoteInput.value = "";
        showRandomQuote(); // show the newly added quote
    }
}

// Event listener for the “Show New Quote” button
document.getElementById("newQuoteBtn").addEventListener("click", showRandomQuote);

// Optional: display one random quote on page load
document.addEventListener("DOMContentLoaded", showRandomQuote);
