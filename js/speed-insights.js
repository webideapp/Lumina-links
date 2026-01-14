/**
 * Speed Insights Integration for LuminaLinks
 * This module initializes Vercel Speed Insights tracking
 * 
 * For production deployment to Vercel, this script will automatically track
 * Core Web Vitals and other performance metrics
 */

const SpeedInsights = {
    /**
     * Initialize Vercel Speed Insights
     * This must be called once in the app and must run on the client
     */
    init() {
        // Check if running in a browser environment
        if (typeof window === 'undefined') {
            console.warn('Speed Insights: Not running in a browser environment');
            return;
        }

        // Create the speed insights queue if it doesn't exist
        if (!window.si) {
            window.si = function() {
                (window.siq = window.siq || []).push(arguments);
            };
        }

        // Inject the Speed Insights script
        this.injectScript();
        
        console.log('Vercel Speed Insights initialized');
    },

    /**
     * Injects the Speed Insights script tag into the document
     */
    injectScript() {
        // Create and configure the script element
        const script = document.createElement('script');
        script.src = '/_vercel/speed-insights/script.js';
        script.defer = true;
        script.async = true;

        // Handle potential errors
        script.onerror = () => {
            console.warn('Speed Insights: Failed to load speed insights script');
        };

        // Append to the document body
        if (document.body) {
            document.body.appendChild(script);
        } else {
            // If body isn't ready yet, wait for it
            document.addEventListener('DOMContentLoaded', () => {
                if (document.body && !document.querySelector('script[src*="speed-insights"]')) {
                    document.body.appendChild(script);
                }
            });
        }
    }
};

// Initialize Speed Insights when the document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SpeedInsights.init());
} else {
    SpeedInsights.init();
}
