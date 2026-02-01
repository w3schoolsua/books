/* Скрипт для окремої книги */
    /* ------------------------------
    ПЛАВНЕ ЗАВАНТАЖЕННЯ
    --------------------------------*/
    window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

    /* ------------------------------
    ТЕМИ + АВТОНІЧНИЙ РЕЖИМ
    --------------------------------*/
    const themeBtn = document.getElementById("themeBtn");
    const root = document.documentElement;

    function applyTheme(theme, manual = false) {
    root.setAttribute("data-theme", theme);
    if (manual) localStorage.setItem("theme", theme);

    themeBtn.textContent =
    theme === "light" ? "🌙" :
    theme === "dark" ? "🔥" :
    "☀️";
}

    function autoTheme() {
    const hour = new Date().getHours();
    const manual = localStorage.getItem("theme");

    if (manual) {
    applyTheme(manual);
    return;
}

    if (hour >= 22 || hour < 6) applyTheme("warm");
    else applyTheme("light");
}

    autoTheme();

    themeBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "light" ? "dark" :
    current === "dark" ? "warm" : "light";
    applyTheme(next, true);
});
    /* ------------------------------
    РЕГУЛЮВАННЯ ШРИФТУ
    --------------------------------*/
    let fontSize = parseInt(localStorage.getItem("fontSize") || 17);

    function updateFont() {
    document.body.style.fontSize = fontSize + "px";
    localStorage.setItem("fontSize", fontSize);
}
    updateFont();

    document.getElementById("fontPlus").onclick = () => {
    fontSize = Math.min(fontSize + 1, 26);
    updateFont();
};
    document.getElementById("fontMinus").onclick = () => {
    fontSize = Math.max(fontSize - 1, 12);
    updateFont();
};
    /* ------------------------------
    ЗБЕРЕЖЕННЯ ПОЗИЦІЇ ЧИТАННЯ
    --------------------------------*/
    window.addEventListener("scroll", () => {
    localStorage.setItem("scrollPos", window.scrollY);
});

    window.addEventListener("load", () => {
    const pos = localStorage.getItem("scrollPos");
    if (pos) window.scrollTo(0, parseInt(pos));
});
    /* ------------------------------
    АВТОМАТИЧНИЙ ЗМІСТ
    --------------------------------*/
    function buildTOC() {
    const tocContainer = document.getElementById("toc-items");
    tocContainer.innerHTML = "";

    const headings = document.querySelectorAll("#page h2, #page h3");

    let currentH2 = null;
    let ul = null;

    headings.forEach(h => {
    const id = h.textContent.trim().toLowerCase().replace(/\s+/g, "-");
    h.id = id;

    if (h.tagName === "H2") {
    // Створюємо пункт розділу
    const link = document.createElement("a");
    link.href = "#" + id;
    link.textContent = h.textContent;

    tocContainer.appendChild(link);

    // Створюємо контейнер для підрозділів
    ul = document.createElement("div");
    ul.style.marginLeft = "15px";
    tocContainer.appendChild(ul);

    currentH2 = ul;
}

    if (h.tagName === "H3" && currentH2) {
    // Створюємо пункт підрозділу
    const subLink = document.createElement("a");
    subLink.href = "#" + id;
    subLink.textContent = h.textContent;
    subLink.style.fontSize = "14px";

    currentH2.appendChild(subLink);
}
});
}
    buildTOC();
    /* ------------------------------
    ПОВНОЕКРАННИЙ РЕЖИМ
    --------------------------------*/
    const fullscreenBtn = document.getElementById("fullscreenBtn");

    fullscreenBtn.onclick = () => {
    if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenBtn.textContent = "🡽";
} else {
    document.exitFullscreen();
    fullscreenBtn.textContent = "⛶";
}
};
    /* ------------------------------
    АВТО-ХОВАННЯ ХЕДЕРА ПРИ СКРОЛІ
    --------------------------------*/
    const header = document.getElementById("header");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
    const current = window.scrollY;
    if (current > lastScrollY + 5) {
    header.classList.add("hidden");
} else if (current < lastScrollY - 5) {
    header.classList.remove("hidden");
}
    lastScrollY = current;
});
    /* -----------------------------------------
    АВТОМАТИЧНЕ ГЕНЕРУВАННЯ SCHEMA.ORG (BOOK)
    + ДИНАМІЧНЕ ОНОВЛЕННЯ МЕТАДАНИХ
    ------------------------------------------*/
    // Базові дані книги (можна змінювати)
    const BOOK_DATA = {
    name: "Твори Володимира Набокова",
    author: "Набоков Володимир Володимирович",
    description: "Читати онлайн / скачати безплатно. Книги В.Набокова. Український переклад",
    url: window.location.href,
    publisher: "W3SchoolsUA",
    language: "uk",
    genre: "Химерна література"
};

    // Створення <script type="application/ld+json">
    function createSchemaScript(json) {
    let el = document.getElementById("schemaBook");
    if (!el) {
    el = document.createElement("script");
    el.id = "schemaBook";
    el.type = "application/ld+json";
    document.head.appendChild(el);
}
    el.textContent = JSON.stringify(json, null, 2);
}

    // Генерація schema.org Book + Chapters
    function generateSchema(activeChapterIndex = 0) {
    const chapters = [...document.querySelectorAll("#page h1")].map((h, i) => ({
    "@type": "Chapter",
    "name": h.textContent.trim(),
    "url": window.location.href.split("#")[0] + "#" + h.id,
    "position": i + 1
}));

    const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": BOOK_DATA.name,
    "author": {
    "@type": "Person",
    "name": BOOK_DATA.author
},
    "description": BOOK_DATA.description,
    "inLanguage": BOOK_DATA.language,
    "url": BOOK_DATA.url,
    "genre": BOOK_DATA.genre,
    "publisher": {
    "@type": "Organization",
    "name": BOOK_DATA.publisher
},
    "hasPart": chapters
};

    // Активний розділ
    schema.isPartOf = chapters[activeChapterIndex];

    createSchemaScript(schema);
}

    // Оновлення <title> і <meta description/>
    function updateMeta(title, description) {
        document.title = title;

        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
    }
        meta.content = description;
    }

    // Визначення активного розділу при скролі
    function trackActiveChapter() {
        const chapters = [...document.querySelectorAll("#page h1")];
        let activeIndex = 0;

        const scrollPos = window.scrollY + window.innerHeight * 0.3;

        chapters.forEach((h, i) => {
        if (h.offsetTop < scrollPos) activeIndex = i;
    });

        const activeTitle = chapters[activeIndex].textContent.trim();

        updateMeta(
        `${activeTitle} — ${BOOK_DATA.name}`,
        `${BOOK_DATA.name}: ${activeTitle}`
        );

        generateSchema(activeIndex);
    }

    // Початкова генерація
    generateSchema();
    updateMeta(BOOK_DATA.name, BOOK_DATA.description);

    // Відстеження активного розділу
    window.addEventListener("scroll", trackActiveChapter);

    // Скрипт для кнопки підняття вгору
    document.addEventListener("DOMContentLoaded", () => {
        const scrollBtn = document.getElementById("scrollTopBtn");
        let hideTimeout;

        function showButton() {
        if (window.scrollY > 300) {
        scrollBtn.classList.add("show");
    }
    }
        function hideButton() {
        scrollBtn.classList.remove("show");
    }
        window.addEventListener("scroll", () => {
        showButton();
        // кожен скрол скидає таймер приховування
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
        hideButton();
    }, 1200); // через 1.2 сек після завершення скролу
    });
        scrollBtn.addEventListener("click", () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    });


// Автоматичне оновлення дати в футері

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