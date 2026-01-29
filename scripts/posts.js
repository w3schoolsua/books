// posts.scripts
// Робота з загальними публікаціями (крім Архіву БЛК)

const POSTS = {
    // Отримати всі публікації
    getAll() {
        return window.CMS.posts || [];
    },

    // Отримати останні N публікацій (усі категорії)
    getLatest(limit = 10) {
        return this.getAll()
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    },

    // Отримати публікації за категорією і роком
    getByCategoryAndYear(category, year) {
        return this.getAll()
            .filter(p => p.category === category && p.year === year)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
};