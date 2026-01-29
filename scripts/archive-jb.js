// archive-jb.scripts
// Робота з публікаціями категорії "Архів БЛК"

const ARCHIVE_BLK = {
    getAll() {
        return window.CMS.archiveBlk || [];
    },

    // Отримати всі роки, в яких є публікації
    getYears() {
        const years = Array.from(new Set(this.getAll().map(p => p.year)));
        return years.sort((a, b) => b - a); // від нового до старого
    },

    // Отримати публікації за роком
    getByYear(year) {
        return this.getAll()
            .filter(p => p.year === year)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    // Отримати останні N публікацій (для головної)
    getLatest(limit = 10) {
        return this.getAll()
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
};