<?php
// ===================================================================
// Minimal token-based auth (no external JWT library, keeps this
// "raw PHP"). A token is a random 64-char string stored in
// auth_tokens, tied to a user and an expiry date. The frontend
// receives it once, from /api/auth/verify-otp, and sends it back
// as "Authorization: Bearer <token>" on every request that needs
// to know who the user is (addresses, orders, wishlist, profile).
// ===================================================================

require_once __DIR__ . '/../config/database.php';

class Auth
{
    public static function generateToken(int $userId): string
    {
        $db = Database::connection();
        $token = bin2hex(random_bytes(32)); // 64 hex chars
        $expiresAt = date('Y-m-d H:i:s', strtotime('+' . AUTH_TOKEN_TTL_DAYS . ' days'));

        $stmt = $db->prepare(
            'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'token' => $token,
            'expires_at' => $expiresAt,
        ]);

        return $token;
    }

    /** Returns the logged-in user's row, or null if not authenticated. */
    public static function user(): ?array
    {
        $token = Request::bearerToken();
        if (!$token) {
            return null;
        }

        $db = Database::connection();
        $stmt = $db->prepare(
            'SELECT u.* FROM auth_tokens t
             JOIN users u ON u.id = t.user_id
             WHERE t.token = :token AND t.expires_at > NOW()
             LIMIT 1'
        );
        $stmt->execute(['token' => $token]);
        $user = $stmt->fetch();

        return $user ?: null;
    }

    /** Ends the request with 401 if there's no valid token; otherwise returns the user row. */
    public static function requireUser(): array
    {
        $user = self::user();
        if (!$user) {
            Response::unauthorized();
        }
        return $user;
    }

    public static function revokeToken(): void
    {
        $token = Request::bearerToken();
        if (!$token) {
            return;
        }
        $db = Database::connection();
        $stmt = $db->prepare('DELETE FROM auth_tokens WHERE token = :token');
        $stmt->execute(['token' => $token]);
    }
}
