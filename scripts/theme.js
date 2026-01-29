/* Автоматичне визначення теми - прибрати миготіння - на початку перед стилями */
    (function() {
    const saved = localStorage.getItem("theme");
    if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
    return;
}
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
})();