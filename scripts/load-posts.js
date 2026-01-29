/* Універсальний скрипт завантаження постів */

document.addEventListener("DOMContentLoaded", () => {
    const postList = document.getElementById("postList");
    const yearSidebar = document.getElementById("yearSidebar");

    if (!postList) return;

    const page = location.pathname.split("/").pop();
    const category = page.replace("category-", "").replace(".html", "");
    const jsonPath = `data/${category}.json`;

    fetch(jsonPath)
        .then(res => res.json())
        .then(posts => {
            if (!Array.isArray(posts)) return;

            // Визначаємо рік з URL
            const params = new URLSearchParams(window.location.search);
            let selectedYear = parseInt(params.get("year"), 10);

            // Генеруємо список років
            const years = [...new Set(posts.map(p => new Date(p.date).getFullYear()))]
                .sort((a, b) => b - a);

            if (yearSidebar) {
                yearSidebar.innerHTML = years.map(y => `
                    <a href="?year=${y}" class="year-link ${y === selectedYear ? "active" : ""}">
                        ${y}
                    </a>
                `).join("");
            }

            // Якщо рік не вибрано — беремо найновіший
            if (!selectedYear || !years.includes(selectedYear)) {
                selectedYear = years[0];
            }

            // Фільтруємо публікації за роком
            const filtered = posts.filter(p => {
                const y = new Date(p.date).getFullYear();
                return y === selectedYear;
            });

            // Рендеримо
            renderPosts(filtered);
        });

    function renderPosts(posts) {
        postList.innerHTML = posts.map(post => `
            <article class="post-card">
                <a href="${post.url}" class="post-link">
                    <img src="${post.image}" alt="${post.title}" class="post-thumb">
                    <div class="post-info">
                        <h3 class="post-title">${post.title}</h3>
                        <div class="post-date">${formatDate(post.date)}</div>
                        <p class="post-summary">${post.summary}</p>
                    </div>
                </a>
            </article>
        `).join("");
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    }
});