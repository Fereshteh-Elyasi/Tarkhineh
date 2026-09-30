<?php
// ===================================================================
// Central place for settings. In real deployment, pull these from
// environment variables instead of hardcoding them here.
// ===================================================================

define('DB_HOST', 'localhost');
define('DB_NAME', 'tarkhineh');
define('DB_USER', 'root');
define('DB_PASS', '');       // <-- put your MySQL password here
define('DB_CHARSET', 'utf8mb4');

// Where uploaded/served images live, relative to this backend's public root.
define('UPLOADS_URL_BASE', '/uploads');

// Allowed origin(s) for the React dev server / production frontend.
// Use '*' only during local development.
define('CORS_ALLOWED_ORIGIN', 'http://localhost:5174');

// How long an auth token stays valid.
define('AUTH_TOKEN_TTL_DAYS', 30);

// How long an OTP code stays valid.
define('OTP_TTL_MINUTES', 20);

// Flat shipping cost used when courier delivery is chosen, matching
// the MOCK_SHIPPING_COST constant in CheckoutInfoPage.jsx.
define('SHIPPING_COST', 29000);

// Show real PHP errors while developing; turn this off in production.
define('APP_DEBUG', true);
