<?php
// ===================================================================
// One PDO connection, reused everywhere via Database::connection().
// Using PDO (not mysqli) because it supports named parameters and
// makes prepared statements/exceptions cleaner.
// ===================================================================

require_once __DIR__ . '/config.php';

class Database
{
    private static ?PDO $instance = null;

    public static function connection(): PDO
    {
        if (self::$instance === null) {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;

            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, [
                    // Throw exceptions instead of silently failing.
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    // Return plain associative arrays from fetch().
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    // Use real prepared statements, not client-side emulation.
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } catch (PDOException $e) {
                // Never leak DB credentials/details to the client.
                http_response_code(500);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error' => 'اتصال به پایگاه داده برقرار نشد']);
                exit;
            }
        }

        return self::$instance;
    }
}
