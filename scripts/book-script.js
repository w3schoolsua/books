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
    const next =
        current === "light" ? "dark" :
            current === "dark" ? "warm" :
                "light";
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
    fontSize = Math.min(fontSize + 1, 32);
    updateFont();
};
document.getElementById("fontMinus").onclick = () => {
    fontSize = Math.max(fontSize - 1, 10);
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

    headings.forEach(h => {
        const id = h.textContent
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
        h.id = id;

        if (h.tagName === "H2") {
            const link = document.createElement("a");
            link.href = "#" + id;
            link.textContent = h.textContent;
            tocContainer.appendChild(link);

            currentH2 = document.createElement("div");
            currentH2.style.marginLeft = "15px";
            tocContainer.appendChild(currentH2);
        }

        if (h.tagName === "H3" && currentH2) {
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

/* ------------------------------
   КНОПКА «ВГОРУ»
--------------------------------*/
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
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(hideButton, 1200);
    });

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

/* ------------------------------
   СПЛИВАЮЧА ПІДКАЗКА ДЛЯ ПРИМІТОК
--------------------------------*/

document.addEventListener("DOMContentLoaded", function() {
    const popup = document.createElement('div');
    popup.className = 'note-popup';
    document.body.appendChild(popup);

    const noteRefs = document.querySelectorAll('.note-ref');

    // Функція для показу
    function showPopup(element) {
        const noteId = element.getAttribute('href').substring(1);
        const noteContent = document.getElementById(noteId);

        if (noteContent) {
            popup.innerHTML = noteContent.innerHTML;
            popup.style.display = 'block';

            const rect = element.getBoundingClientRect();
            popup.style.top = (window.scrollY + rect.top - popup.offsetHeight - 10) + 'px';
            popup.style.left = (window.scrollX + rect.left - 20) + 'px';
        }
    }

    // Функція для приховування
    function hidePopup() {
        popup.style.display = 'none';
    }

    noteRefs.forEach(ref => {
        // ДЛЯ ДЕСКТОПІВ: Наведення миші
        ref.addEventListener('mouseenter', function() {
            showPopup(this);
        });

        ref.addEventListener('mouseleave', hidePopup);

        // ДЛЯ МОБІЛЬНИХ: Клік (тач)
        ref.addEventListener('click', function(e) {
            e.preventDefault(); // ЗАБОРОНЯЄ перехід вниз сторінки

            // Якщо вікно вже відкрите для цього елемента — закриваємо, інакше — показуємо
            if (popup.style.display === 'block') {
                hidePopup();
            } else {
                showPopup(this);
            }
        });
    });

    // Закривати підказку, якщо клікнути будь-де на екрані поза нею
    document.addEventListener('click', function(e) {
        if (![...noteRefs].some(ref => ref.contains(e.target)) && !popup.contains(e.target)) {
            hidePopup();
        }
    });
});
