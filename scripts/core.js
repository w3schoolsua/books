// 1. Вставлення partials
async function includePartials() {
    const blocks = document.querySelectorAll("[data-include]");
    for (const el of blocks) {
        const name = el.getAttribute("data-include");
        const resp = await fetch(`partials/${name}.html`, { cache: "no-cache" });
        el.innerHTML = await resp.text();
    }
}

// 2. Тема
function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
}

function setupThemeToggle() {
    document.addEventListener("click", e => {
        if (e.target.id === "themeToggle") {
            const current = document.documentElement.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
        }
    });
}

// 3. Рік у футері
function initYear() {
    const yearRange = document.getElementById("yearRange");
    const updatedInfo = document.getElementById("updatedInfo");
    if (!yearRange) return;

    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    yearRange.innerHTML = currentYear > startYear
        ? `${startYear}&ndash;${currentYear}`
        : startYear;

    if (updatedInfo) {
        const d = new Date(document.lastModified);
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yy = d.getFullYear();
        updatedInfo.textContent = `(оновлено: ${dd}.${mm}.${yy})`;
    }
}

// 4. Бургер
function initBurger() {
    document.addEventListener("click", e => {
        if (e.target.closest("#burgerBtn")) {
            const nav = document.getElementById("mainNav");
            if (nav) nav.classList.toggle("nav-open");
        }
    });
}

// 5. Кнопка нагору
function initScrollTop() {
    const btn = document.getElementById("scrollTopBtn");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) btn.classList.add("show");
        else btn.classList.remove("show");
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// 6. Автогенерація меню з JSON
async function initMenu() {
    const nav = document.getElementById("mainNav");
    if (!nav) return;

    try {
        const resp = await fetch("data/menu.json", { cache: "force-cache" });
        const items = await resp.json();
        nav.innerHTML = items.map(item => `
            <a href="${item.url}">${item.title}</a>
        `).join("");
    } catch (e) {
        console.error("Помилка завантаження меню:", e);
    }
}

// 7. Завантаження публікацій для сторінок категорій
function initPosts() {
    const postList = document.getElementById("postList");
    if (!postList) return;

    const page = location.pathname.split("/").pop();
    const category = page.replace("category-", "").replace(".html", "");
    const jsonPath = `data/${category}.json`;

    fetch(jsonPath, { cache: "force-cache" })
        .then(r => r.json())
        .then(posts => {
            const html = posts.map(p => `
                <article class="post-card">
                    <a href="${p.url}" class="post-link">
                        <img src="${p.image}" class="post-thumb" alt="${p.title}">
                        <div class="post-info">
                            <h3 class="post-title">${p.title}</h3>
                            <div class="post-date">${formatDate(p.date)}</div>
                            <p class="post-summary">${p.summary}</p>
                        </div>
                    </a>
                </article>
            `).join("");
            postList.innerHTML = html;
        })
        .catch(() => {
            postList.innerHTML = "<p>Не вдалося завантажити публікації.</p>";
        });
}

function formatDate(str) {
    const d = new Date(str);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}.${mm}.${yy}`;
}

// 8. Ініціалізація
document.addEventListener("DOMContentLoaded", async () => {
    await includePartials();
    initTheme();
    setupThemeToggle();
    initBurger();
    initScrollTop();
    initYear();
    initMenu();
    initPosts();
});