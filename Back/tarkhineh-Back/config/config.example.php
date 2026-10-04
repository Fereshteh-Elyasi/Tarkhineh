<?php
// کپی این فایل به config.php و مقادیر را برای محیط خودتان تنظیم کنید.
// php -r "copy('config/config.example.php', 'config/config.php');"

define('DB_HOST', 'localhost');
define('DB_NAME', 'tarkhineh');
define('DB_USER', 'root');
define('DB_PASS', '');       // رمز MySQL خودتان
define('DB_CHARSET', 'utf8mb4');

define('UPLOADS_URL_BASE', '/uploads');
define('CORS_ALLOWED_ORIGIN', 'http://localhost:5173');
define('AUTH_TOKEN_TTL_DAYS', 30);
define('OTP_TTL_MINUTES', 20);
define('SHIPPING_COST', 29000);
define('APP_DEBUG', true);
