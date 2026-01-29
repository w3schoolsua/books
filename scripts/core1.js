// core.scripts
// Ядро CMS: завантаження JSON-даних і кешування

window.CMS = {
    posts: [],
    archiveBlk: [],
    loaded: false
};

async function loadCMSData() {
    if (window.CMS.loaded) return;

    try {
        // Завантажуємо загальні публікації
        const postsRes = await fetch("data/posts.json");
        window.CMS.posts = await postsRes.json();

        // Завантажуємо Архів БЛК
        const blkRes = await fetch("data/archive-blk.json");
        window.CMS.archiveBlk = await blkRes.json();

        window.CMS.loaded = true;
    } catch (e) {
        console.error("Помилка завантаження даних CMS:", e);
    }
}