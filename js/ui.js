/**
 * UI Manager for LuminaLinks
 * Handles all DOM manipulations and view states
 */

const UI = {
    elements: {
        form: document.getElementById('shorten-form'),
        input: document.getElementById('url-input'),
        button: document.getElementById('shorten-btn'),
        linksList: document.getElementById('links-list'),
        themeToggle: document.getElementById('theme-toggle'),
        toastContainer: document.getElementById('toast-container')
    },

    /**
     * Toggles the loading state of the UI
     */
    setLoading(isLoading) {
        if (isLoading) {
            this.elements.button.disabled = true;
            this.elements.button.classList.add('loading');
            this.elements.button.innerHTML = `
                <span class="spinner-inner"><i class="fas fa-circle-notch fa-spin"></i></span>
                <span>Shortening...</span>
            `;
            this.elements.button.style.opacity = '0.8';
        } else {
            this.elements.button.disabled = false;
            this.elements.button.classList.remove('loading');
            this.elements.button.innerHTML = `
                <span>Shorten</span>
                <i class="fas fa-arrow-right"></i>
            `;
            this.elements.button.style.opacity = '1';
        }
    },

    /**
     * Displays a toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} animate-slide-in-right`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${icons[type] || icons.info}"></i>
                <span>${message}</span>
            </div>
            <div class="toast-progress"></div>
        `;
        
        this.elements.toastContainer.appendChild(toast);

        // Auto remove after 4s
        setTimeout(() => {
            toast.classList.replace('animate-slide-in-right', 'animate-fade-out');
            toast.addEventListener('animationend', () => toast.remove());
        }, 4000);
    },

    /**
     * Renders the list of links to the dashboard
     */
    renderLinks(links) {
        if (!links || links.length === 0) {
            this.elements.linksList.innerHTML = `
                <div class="empty-state animate-fade-in">
                    <div class="empty-icon"><i class="fas fa-history"></i></div>
                    <p>No links shortened yet. Your history will appear here.</p>
                </div>
            `;
            return;
        }

        // Sort by date descending (newest first)
        const sortedLinks = [...links].sort((a, b) => b.timestamp - a.timestamp);

        this.elements.linksList.innerHTML = sortedLinks.map((link, index) => `
            <div class="link-card animate-slide-up" style="animation-delay: ${index * 50}ms">
                <div class="link-main">
                    <div class="link-info">
                        <a href="${link.shortenedUrl}" target="_blank" class="short-link">${link.shortenedUrl}</a>
                        <span class="original-link" title="${link.originalUrl}">${link.originalUrl}</span>
                    </div>
                    <div class="link-meta">
                        <span class="link-date"><i class="far fa-calendar-alt"></i> ${Utils.formatDate(link.timestamp)}</span>
                    </div>
                </div>
                <div class="link-actions">
                    <button class="btn-action" onclick="App.handleCopy('${link.shortenedUrl}')" title="Copy Link">
                        <i class="fas fa-copy"></i> <span>Copy</span>
                    </button>
                    <button class="btn-action" onclick="App.showQR('${link.shortenedUrl}')" title="Show QR">
                        <i class="fas fa-qrcode"></i> <span>QR</span>
                    </button>
                    <button class="btn-action btn-delete" onclick="App.deleteLink('${link.id}')" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    /**
     * Displays the QR code modal
     */
    showQRModal(url) {
        const modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.innerHTML = `
            <div class="qr-content animate-scale-up">
                <button class="btn-close" aria-label="Close modal"><i class="fas fa-times"></i></button>
                <div class="qr-header">
                    <h3>QR Code</h3>
                </div>
                <div class="qr-image-container">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}" alt="QR Code" onload="this.classList.add('loaded')">
                    <div class="qr-skeleton"><i class="fas fa-circle-notch fa-spin" style="color: var(--primary); font-size: 2rem;"></i></div>
                </div>
                <div class="qr-footer">
                    <button class="btn-primary btn-full" id="modal-done-btn">Done</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        const closeModal = () => {
            modal.style.opacity = '0';
            modal.querySelector('.qr-content').style.transform = 'scale(0.95)';
            setTimeout(() => modal.remove(), 200);
        };

        // Event Listeners
        modal.querySelector('.btn-close').addEventListener('click', closeModal);
        modal.querySelector('#modal-done-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
};