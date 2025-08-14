// Quotes array with objects containing text and category
let quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It's not whether you get knocked down, it's whether you get up.", category: "Resilience" }
];

// Function to display a random quote
function displayRandomQuote() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    let selectedQuote = quotes[randomIndex];

    document.getElementById("quoteDisplay").innerHTML = `"${selectedQuote.text}"`;
    document.getElementById("quoteCategory").innerHTML = `Category: ${selectedQuote.category}`;
}

// Function to add a new quote
function addQuote() {
    let newQuoteText = document.getElementById("quoteText").value.trim();
    let newQuoteCategory = document.getElementById("quoteCategoryInput").value.trim();

    if (newQuoteText !== "" && newQuoteCategory !== "") {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById("quoteText").value = "";
        document.getElementById("quoteCategoryInput").value = "";
        displayRandomQuote();
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);

// Event listener for the "Add Quote" button
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Display an initial random quote when page loads
window.onload = displayRandomQuote;