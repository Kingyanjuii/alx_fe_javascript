// script.js

(() => {
  // ====== Configuration & State ======
  const STORAGE_KEY = "dynamic_quote_generator_v1";

  /** Seed quotes (used on first run or if storage is cleared) */
  const seedQuotes = [
    { text: "Creativity is intelligence having fun.", category: "Creativity" },
    { text: "Simplicity is the soul of efficiency.", category: "Design" },
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Talk is cheap. Show me the code.", category: "Tech" },
    { text: "If you want to go fast, go alone. If you want to go far, go together.", category: "Wisdom" },
    { text: "Every artist was first an amateur.", category: "Creativity" },
    { text: "Good design is as little design as possible.", category: "Design" },
    { text: "You miss 100% of the shots you don’t take.", category: "Motivation" },
    { text: "First, solve the problem. Then, write the code.", category: "Tech" },
    { text: "A good name is better than riches.", category: "Proverb" },
  ];

  /** App state */
  let quotes = [];             // [{ text, category }, ...]
  let currentCategory = "All"; // filter state

  // ====== DOM References (static nodes in HTML) ======
  const controls = document.getElementById("controls");
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");

  // ====== Utilities ======
  const saveQuotesToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    } catch (err) {
      console.warn("Could not save quotes to storage:", err);
    }
  };

  const loadQuotesFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const normalizeCategory = (cat) => (cat || "").trim().replace(/\s+/g, " ");

  const getAllCategories = () => {
    const set = new Set(quotes.map(q => normalizeCategory(q.category)).filter(Boolean));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  };

  const randomIndex = (n) => Math.floor(Math.random() * n);

  // ====== Rendering Helpers ======
  const clearNode = (node) => {
    while (node.firstChild) node.removeChild(node.firstChild);
  };

  /** Render a quote object into #quoteDisplay (accessible, no layout shift) */
  const renderQuote = ({ text, category }) => {
    clearNode(quoteDisplay);

    const block = document.createElement("blockquote");
    block.textContent = text;

    const cite = document.createElement("cite");
    cite.textContent = `— ${category || "Uncategorized"}`;

    quoteDisplay.append(block, cite);
  };

  // ====== Core Features ======

  /**
   * showRandomQuote(category?)
   * Displays a random quote filtered by the provided category (or current state).
   * If no quotes match, shows a helpful message.
   */
  const showRandomQuote = (category = currentCategory) => {
    const targetCat = category || "All";
    const pool = targetCat === "All"
      ? quotes
      : quotes.filter(q => normalizeCategory(q.category) === targetCat);

    if (pool.length === 0) {
      clearNode(quoteDisplay);
      const p = document.createElement("p");
      p.textContent = `No quotes found for category: ${targetCat}. Add one below!`;
      quoteDisplay.appendChild(p);
      return;
    }

    const chosen = pool[randomIndex(pool.length)];
    renderQuote(chosen);
  };

  /**
   * createAddQuoteForm()
   * Builds the "Add Quote" form entirely via JS and appends it to #controls.
   * Demonstrates advanced DOM APIs: createElement, setAttribute, classList, events, and validation.
   */
  const createAddQuoteForm = () => {
    // Wrapper
    const form = document.createElement("form");
    form.className = "row";
    form.setAttribute("aria-label", "Add a new quote");

    // Quote text input
    const textLabel = document.createElement("label");
    textLabel.textContent = "Quote";
    textLabel.setAttribute("for", "newQuoteText");

    const textInput = document.createElement("input");
    textInput.id = "newQuoteText";
    textInput.type = "text";
    textInput.placeholder = "Enter a new quote";
    textInput.required = true;
    textInput.minLength = 3;

    // Category input
    const catLabel = document.createElement("label");
    catLabel.textContent = "Category";
    catLabel.setAttribute("for", "newQuoteCategory");

    const catInput = document.createElement("input");
    catInput.id = "newQuoteCategory";
    catInput.type = "text";
    catInput.placeholder = "Enter quote category";
    catInput.required = true;
    catInput.minLength = 2;

    // Submit button
    const addBtn = document.createElement("button");
    addBtn.type = "submit";
    addBtn.textContent = "Add Quote";

    // Error area
    const error = document.createElement("div");
    error.className = "error";
    error.setAttribute("aria-live", "polite");

    // Help text
    const help = document.createElement("div");
    help.className = "help";
    help.textContent = "Tip: Categories power the filter. Keep names consistent (e.g., “Design”, “Tech”).";

    // Append in logical order
    form.append(
      textLabel, textInput,
      catLabel, catInput,
      addBtn
    );

    controls.append(form, help, error);

    // Handle submit (no inline onclick; advanced DOM event handling)
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      error.textContent = "";

      const text = (textInput.value || "").trim();
      const category = normalizeCategory(catInput.value);

      // Basic validation
      if (text.length < 3) {
        error.textContent = "Quote is too short.";
        textInput.focus();
        return;
      }
      if (category.length < 2) {
        error.textContent = "Category is too short.";
        catInput.focus();
        return;
      }

      // Add to state
      quotes.push({ text, category });
      saveQuotesToStorage();

      // Rebuild category filter (in case this is a new category)
      buildCategoryFilter();

      // If user is filtered to that category, immediately show something new there
      if (currentCategory === "All" || currentCategory === category) {
        showRandomQuote(currentCategory);
      }

      // Clear inputs for a nice UX
      textInput.value = "";
      catInput.value = "";
      textInput.focus();
    });
  };

  /**
   * buildCategoryFilter()
   * Creates/updates a <select> for categories dynamically.
   */
  const buildCategoryFilter = () => {
    // Remove an existing select if present (idempotent building)
    const existing = controls.querySelector("#categoryFilter");
    if (existing) existing.remove();

    const label = document.createElement("label");
    label.textContent = "Category";
    label.setAttribute("for", "categoryFilter");

    const select = document.createElement("select");
    select.id = "categoryFilter";
    select.setAttribute("aria-label", "Filter by category");

    // Build options from current state
    const cats = getAllCategories();
    cats.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      if (cat === currentCategory) opt.selected = true;
      select.appendChild(opt);
    });

    // Insert at the start of controls for good layout
    controls.prepend(select);
    controls.prepend(label);

    // Event handling (change filter + show new quote under that filter)
    select.addEventListener("change", (e) => {
      currentCategory = e.target.value;
      showRandomQuote(currentCategory);
    });
  };

  // ====== App Bootstrap ======
  const init = () => {
    // Load saved or seed data
    const stored = loadQuotesFromStorage();
    quotes = Array.isArray(stored) && stored.length ? stored : seedQuotes.slice();

    // Build UI
    buildCategoryFilter();
    createAddQuoteForm();

    // Wire up the "Show New Quote" button
    newQuoteBtn.addEventListener("click", () => showRandomQuote(currentCategory));

    // Initial render
    showRandomQuote(currentCategory);
  };

  // Ready
  document.addEventListener("DOMContentLoaded", init);
})();
