<?php
// ===================================================================
// Every endpoint replies through here, so the response shape
// (status code + JSON body) is consistent across the whole API.
// ===================================================================

class Response
{
    public static function json($data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success($data = null, int $status = 200): void
    {
        self::json($data ?? ['ok' => true], $status);
    }

    public static function error(string $message, int $status = 400): void
    {
        self::json(['error' => $message], $status);
    }

    public static function notFound(string $message = 'یافت نشد'): void
    {
        self::error($message, 404);
    }

    public static function unauthorized(string $message = 'ابتدا وارد شوید'): void
    {
        self::error($message, 401);
    }
}
