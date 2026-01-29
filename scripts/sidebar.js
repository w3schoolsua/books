// sidebar.scripts
// Генерація меню років (2012–2022) + підсвічування активного року

const YEARS = {
    min: 2012,
    max: 2022
};

function renderYearSidebar(activeYear = null) {
    const sidebar = document.getElementById("yearsSidebar");
    if (!sidebar) return;

    let yearsHtml = "";
    for (let y = YEARS.max; y >= YEARS.min; y--) {
        const isActive = activeYear === y;
        yearsHtml += `
            <div class="year-item ${isActive ? "year-item-active" : ""}">
                <a href="?year=${y}">${y}</a>
            </div>
        `;
    }

    sidebar.innerHTML = yearsHtml;
}