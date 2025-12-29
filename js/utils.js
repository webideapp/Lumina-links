/**
 * Utility functions for LuminaLinks
 */

const Utils = {
    /**
     * Generates a unique ID for link entries
     */
    generateId: () => Math.random().toString(36).substring(2, 11),

    /**
     * Validates if a string is a valid URL
     */
    isValidUrl: (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    },

    /**
     * LocalStorage management wrapper
     */
    storage: {
        saveLink: (linkEntry) => {
            const links = Utils.storage.getLinks();
            links.push(linkEntry);
            localStorage.setItem('lumina_links', JSON.stringify(links));
        },
        getLinks: () => {
            const data = localStorage.getItem('lumina_links');
            return data ? JSON.parse(data) : [];
        },
        removeLink: (id) => {
            const links = Utils.storage.getLinks();
            const filtered = links.filter(link => link.id !== id);
            localStorage.setItem('lumina_links', JSON.stringify(filtered));
            return filtered;
        }
    },

    /**
     * Formats timestamp into a readable date
     */
    formatDate: (timestamp) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(timestamp));
    },

    /**
     * Copies text to clipboard using the Modern Clipboard API
     */
    copyToClipboard: async (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers or non-secure contexts
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            textArea.remove();
        }
    }
};