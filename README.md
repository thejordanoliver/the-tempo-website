# Tempo website

Static GitHub Pages site. Publish main / (root). No build step required.

Uses the app’s Oswald and Barlow Condensed fonts, monochrome colors, 12px rounded surfaces, and automatic light/dark themes. Fonts are self-hosted. No analytics or external scripts are added.

The privacy policy remains a draft; see PRIVACY-REVIEW.md before launch. The older tempo-website/ URLs are retained for compatibility.

## Website login
Uses the temporary LAN backend http://192.168.1.225:4000 via POST /api/login. Preview with python3 -m http.server on a device on the same network. Public HTTPS hosting cannot call this HTTP API: the form explicitly explains the limitation and stays disabled there. No tokens are persisted. Successful sign-in displays an account confirmation, not the full mobile app. Existing backend login rotates the account’s refresh tokens, so test sign-in can affect other sessions. Configure a public HTTPS API before enabling public website login.
