/**
 * Main Application Logic for LuminaLinks
 */

const App = {
    init() {
        this.bindEvents();
        this.loadHistory();
        this.initTheme();
    },

    bindEvents() {
        UI.elements.form.addEventListener('submit', (e) => this.handleShorten(e));
        
        if (UI.elements.themeToggle) {
            UI.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    },

    async handleShorten(e) {
        e.preventDefault();
        const longUrl = UI.elements.input.value.trim();

        if (!Utils.isValidUrl(longUrl)) {
            UI.showToast('Please enter a valid URL (including http:// or https://)', 'error');
            return;
        }

        try {
            UI.setLoading(true);

            // Call the API service to get shortened URL
            const shortUrl = await ApiService.shortenUrl(longUrl);

            // Create link entry object
            const linkEntry = {
                id: Utils.generateId(),
                originalUrl: longUrl,
                shortenedUrl: shortUrl,
                timestamp: Date.now()
            };

            // Update storage
            Utils.storage.saveLink(linkEntry);

            // Update UI
            UI.renderLinks(Utils.storage.getLinks());
            UI.elements.input.value = '';
            UI.showToast('Link shortened successfully!', 'success');
            
            // Optional: Auto-trigger QR modal for new link or focus result
            // this.showQR(shortUrl);

        } catch (error) {
            UI.showToast(error.message || 'An error occurred while shortening the link.', 'error');
        } finally {
            UI.setLoading(false);
        }
    },

    async handleCopy(url) {
        try {
            await Utils.copyToClipboard(url);
            UI.showToast('Copied to clipboard!', 'success');
        } catch (err) {
            UI.showToast('Failed to copy link.', 'error');
        }
    },

    showQR(url) {
        UI.showQRModal(url);
    },

    deleteLink(id) {
        const updatedLinks = Utils.storage.removeLink(id);
        UI.renderLinks(updatedLinks);
        UI.showToast('Link removed from history', 'info');
    },

    loadHistory() {
        const links = Utils.storage.getLinks();
        UI.renderLinks(links);
    },

    initTheme() {
        const savedTheme = localStorage.getItem('lumina_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('lumina_theme', newTheme);
        this.updateThemeIcon(newTheme);
    },

    updateThemeIcon(theme) {
        const icon = UI.elements.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
};

// Bootstrap the application
document.addEventListener('DOMContentLoaded', () => App.init());