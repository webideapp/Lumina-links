/**
 * API Service for LuminaLinks
 * Handles interactions with ShrinkMe.io
 */

const SHRINKME_API_TOKEN = 'b5610c7cd8cad72cc96cb5c07a42cfe708391805';

const ApiService = {
    /**
     * Shortens a long URL using the ShrinkMe.io API
     * @param {string} longUrl 
     * @returns {Promise<string>} The shortened URL
     */
    async shortenUrl(longUrl) {
        try {
            // Construct the API URL per instructions: token, url, and format=text
            const endpoint = `https://shrinkme.io/api?api=${SHRINKME_API_TOKEN}&url=${encodeURIComponent(longUrl)}&format=text`;

            const response = await fetch(endpoint, {
                method: 'GET',
                mode: 'cors' // Note: ShrinkMe API might require a proxy in production due to CORS
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const shortUrl = await response.text();

            // ShrinkMe API returns an empty string or generic error text if failed in text format
            if (!shortUrl || shortUrl.trim() === '' || shortUrl.toLowerCase().includes('error')) {
                throw new Error('API returned an invalid response. Please check your URL or API key.');
            }

            return shortUrl.trim();
        } catch (error) {
            console.error('ApiService Error:', error);
            throw error;
        }
    }
};