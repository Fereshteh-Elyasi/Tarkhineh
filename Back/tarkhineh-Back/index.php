<?php
// ===================================================================
// Front controller. Every request hits this file (via .htaccess
// rewrite), which:
//   1. Sends CORS headers so the Vite dev server (or prod frontend)
//      is allowed to call this API from a different origin.
//   2. Figures out the HTTP method + path.
//   3. Matches it against a small route table and calls the right
//      controller method.
// No framework - just $_SERVER parsing and a switch-like match.
// ===================================================================

require_once __DIR__ . '/config/config.php';

if (APP_DEBUG) {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
}

require_once __DIR__ . '/core/Response.php';
require_once __DIR__ . '/core/Request.php';
require_once __DIR__ . '/core/Auth.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/MenuController.php';
require_once __DIR__ . '/controllers/BranchController.php';
require_once __DIR__ . '/controllers/SearchController.php';
require_once __DIR__ . '/controllers/AddressController.php';
require_once __DIR__ . '/controllers/OrderController.php';
require_once __DIR__ . '/controllers/WishlistController.php';
require_once __DIR__ . '/controllers/DiscountController.php';

// ---------- CORS ----------
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $requestOrigin)) {
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
} else {
    header('Access-Control-Allow-Origin: ' . CORS_ALLOWED_ORIGIN);
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
// Browsers send a preflight OPTIONS request before PUT/DELETE/etc.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------- figure out method + path ----------
$method = $_SERVER['REQUEST_METHOD'];

// Strip the query string and the "/api" prefix, e.g.
// "/tarkhineh/backend/api/branches/vanak?x=1" -> "/branches/vanak"
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^.*?/api#', '', $path);   // keep everything after "/api"
$path = '/' . trim($path, '/');                  // normalize to "/branches/vanak"

// ---------- route table ----------
// Each entry: [METHOD, regex pattern with named groups, [Controller, method]]
$routes = [
    ['POST',   '#^/auth/send-otp$#',            ['AuthController', 'sendOtp']],
    ['POST',   '#^/auth/verify-otp$#',           ['AuthController', 'verifyOtp']],
    ['POST',   '#^/auth/logout$#',               ['AuthController', 'logout']],
    ['GET',    '#^/auth/me$#',                   ['AuthController', 'me']],
    ['PUT',    '#^/auth/me$#',                   ['AuthController', 'updateMe']],

    ['GET',    '#^/menu/tabs$#',                 ['MenuController', 'tabs']],
    ['GET',    '#^/menu/items$#',                ['MenuController', 'items']],

    ['GET',    '#^/branches$#',                  ['BranchController', 'index']],
    ['GET',    '#^/branches/(?<slug>[a-z0-9-]+)$#',          ['BranchController', 'show']],
    ['GET',    '#^/branches/(?<slug>[a-z0-9-]+)/dishes$#',   ['BranchController', 'dishes']],
    ['GET',    '#^/branches/(?<slug>[a-z0-9-]+)/reviews$#',  ['BranchController', 'reviews']],

    ['GET',    '#^/search$#',                    ['SearchController', 'index']],

    ['GET',    '#^/addresses$#',                 ['AddressController', 'index']],
    ['POST',   '#^/addresses$#',                 ['AddressController', 'store']],
    ['PUT',    '#^/addresses/(?<id>\d+)$#',       ['AddressController', 'update']],
    ['DELETE', '#^/addresses/(?<id>\d+)$#',       ['AddressController', 'destroy']],

    ['GET',    '#^/orders$#',                    ['OrderController', 'index']],
    ['POST',   '#^/orders$#',                    ['OrderController', 'store']],
    ['GET',    '#^/orders/(?<id>\d+)$#',          ['OrderController', 'show']],
    ['POST',   '#^/orders/(?<id>\d+)/cancel$#',   ['OrderController', 'cancel']],

    ['GET',    '#^/wishlist$#',                  ['WishlistController', 'index']],
    ['POST',   '#^/wishlist$#',                  ['WishlistController', 'store']],
    ['DELETE', '#^/wishlist/(?<menuItemId>[a-z0-9-]+)$#', ['WishlistController', 'destroy']],

    ['POST',   '#^/discount/apply$#',             ['DiscountController', 'apply']],
    ['POST',   '#^/payment/confirm$#',            ['DiscountController', 'confirmPayment']],
];

foreach ($routes as [$routeMethod, $pattern, $handler]) {
    if ($routeMethod !== $method) {
        continue;
    }
    if (preg_match($pattern, $path, $matches)) {
        // keep only the named capture groups (slug, id, menuItemId, ...)
        $params = array_filter($matches, fn($k) => !is_int($k), ARRAY_FILTER_USE_KEY);
        [$controllerName, $methodName] = $handler;
        $controller = new $controllerName();
        $controller->$methodName($params);
        exit;
    }
}

Response::notFound('مسیر درخواستی یافت نشد');
