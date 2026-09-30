<?php
// ===================================================================
// Wraps $_GET / php://input so controllers don't repeat this boilerplate.
// The React app sends JSON bodies (fetch + JSON.stringify), so we
// decode php://input as JSON rather than relying on $_POST.
// ===================================================================

class Request
{
    private static ?array $body = null;

    public static function method(): string
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public static function query(string $key, $default = null)
    {
        return $_GET[$key] ?? $default;
    }

    public static function body(): array
    {
        if (self::$body === null) {
            $raw = file_get_contents('php://input');
            $decoded = json_decode($raw, true);
            self::$body = is_array($decoded) ? $decoded : [];
        }
        return self::$body;
    }

    public static function input(string $key, $default = null)
    {
        $body = self::body();
        return $body[$key] ?? $default;
    }

    /** Bearer token from the Authorization header. */
    public static function bearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? null;

        if (!$header) {
            // Some servers (e.g. PHP built-in server via .htaccess-less setups)
            // don't populate HTTP_AUTHORIZATION; fall back to apache_request_headers.
            if (function_exists('apache_request_headers')) {
                $headers = apache_request_headers();
                $header = $headers['Authorization'] ?? null;
            }
        }

        if ($header && preg_match('/Bearer\s+(\S+)/', $header, $m)) {
            return $m[1];
        }

        return null;
    }
}
