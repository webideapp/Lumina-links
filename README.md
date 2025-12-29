# LuminaLinks - Premium URL Shortener

LuminaLinks is a modern, responsive URL shortening platform built with a high-end SaaS aesthetic (Stripe/Vercel style). It leverages the ShrinkMe.io API to provide fast and reliable link management.

## Features
- **Clean SaaS UI**: Minimalist design with glassmorphism and smooth animations.
- **Dark/Light Mode**: Full system and manual theme toggling support.
- **Local Persistence**: Your link history is stored securely in your browser.
- **QR Code Generation**: Instantly generate QR codes for any shortened link.
- **One-click Copy**: Quickly copy your links to the clipboard.

## Setup
1. Open `js/api.js`.
2. Locate `API_CONFIG`.
3. Replace `YOUR_API_KEY_HERE` with your actual ShrinkMe.io API key from your dashboard.

## Development
The project is broken down into modular files:
- `index.html`: Main layout and entry point.
- `style.css`: Core design system and layout.
- `assets/css/animations.css`: Specialized UI transitions and loading states.
- `js/api.js`: Handles communication with ShrinkMe.io.
- `js/ui.js`: Manages DOM manipulation and visual feedback.
- `js/utils.js`: Helper functions for storage and validation.
- `script.js`: Orchestrates the application logic.