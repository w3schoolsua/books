// render.scripts
// Шаблони для відображення публікацій

function renderPostCard(post) {
    const categoryLabel = mapCategoryLabel(post.category);

    return `
        <div class="post-list-item">
            <div class="post-list-item-meta">
                <span>${categoryLabel}</span> · 
                <span>${formatDate(post.date)}</span>
            </div>
            <div class="post-list-item-title">
                <a href="${post.url}">${post.title}</a>
            </div>
            <div class="post-list-item-excerpt">
                ${post.excerpt}
            </div>
        </div>
    `;
}

function renderPostList(posts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!posts.length) {
        container.innerHTML = `<p>Немає публікацій за обраними умовами.</p>`;
        return;
    }

    container.innerHTML = posts.map(renderPostCard).join("");
}

// Мапінг технічної категорії на людинозрозумілу
function mapCategoryLabel(category) {
    switch (category) {
        case "archive": return "Архів БЛК";
        case "news": return "Новини";
        case "articles": return "Статті";
        case "video": return "Відео";
        case "photo": return "Фото";
        case "ads": return "Оголошення";
        default: return "Публікація";
    }
}

// Форматування дати (YYYY-MM-DD → DD.MM.YYYY)
function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
}