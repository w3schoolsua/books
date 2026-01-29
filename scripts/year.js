/*
document.addEventListener("DOMContentLoaded", () => {
    const yearRange = document.getElementById("yearRange");
    const updatedInfo = document.getElementById("updatedInfo");

    const startYear = 2025;
    const currentYear = new Date().getFullYear();

    // Використовуємо HTML-код &ndash; замість символу тире
    if (currentYear > startYear) {
        yearRange.innerHTML = `${startYear}&ndash;${currentYear}`;
    } else {
        yearRange.textContent = startYear;
    }

    // Дата оновлення (опціонально)
    const updated = document.lastModified;
    if (updatedInfo) {
        updatedInfo.textContent = ` (оновлено: ${updated.split(" ")[0]})`;
    }
});*/
document.addEventListener("DOMContentLoaded", () => {
    const yearRange = document.getElementById("yearRange");
    const updatedInfo = document.getElementById("updatedInfo");

    const startYear = 2025;
    const currentYear = new Date().getFullYear();

    // Виводимо діапазон років
    if (currentYear > startYear) {
        yearRange.innerHTML = `${startYear}&ndash;${currentYear}`;
    } else {
        yearRange.textContent = startYear;
    }

    // Формат дати оновлення: DD.MM.YYYY
    if (updatedInfo) {
        const updated = new Date(document.lastModified);
        const day = String(updated.getDate()).padStart(2, "0");
        const month = String(updated.getMonth() + 1).padStart(2, "0");
        const year = updated.getFullYear();
        updatedInfo.textContent = ` (оновлено: ${day}.${month}.${year})`;
    }
});