<?php
// ===================================================================
// Matches the flow already built in AuthModal.jsx:
//   1. user types phone -> POST /auth/send-otp        {phone}
//   2. user types 5-digit code -> POST /auth/verify-otp {phone, code}
//      -> returns {token, user}; frontend stores token and calls
//         login(user) exactly like it does today with the mock data.
// ===================================================================

require_once __DIR__ . '/../config/database.php';

class AuthController
{
    /** POST /api/auth/send-otp  {phone} */
    public function sendOtp(array $params): void
    {
        $phone = trim((string) Request::input('phone', ''));

        if (!preg_match('/^0\d{10}$/', $phone)) {
            Response::error('شماره موبایل معتبر نیست', 422);
        }

        $code = (string) random_int(10000, 99999); // 5 digits, like otpValues in AuthModal.jsx

        $db = Database::connection();
        $stmt = $db->prepare(
            'INSERT INTO otp_codes (phone, code, expires_at) VALUES (:phone, :code, DATE_ADD(NOW(), INTERVAL :ttl MINUTE))'
        );
        $stmt->execute(['phone' => $phone, 'code' => $code, 'ttl' => OTP_TTL_MINUTES]);

        // TODO: plug in a real SMS provider (e.g. Kavenegar, Ghasedak) here.
        // For local development we just log it so you can see the code.
        error_log("OTP for {$phone}: {$code}");

        $response = ['message' => 'کد تایید ارسال شد'];
        if (APP_DEBUG) {
            $response['debug_code'] = $code; // remove this key once a real SMS gateway is wired in
        }

        Response::success($response);
    }

    /** POST /api/auth/verify-otp  {phone, code} */
    public function verifyOtp(array $params): void
    {
        $phone = trim((string) Request::input('phone', ''));
        $code = trim((string) Request::input('code', ''));

        if (!$phone || !$code) {
            Response::error('شماره موبایل و کد تایید الزامی است', 422);
        }

        $db = Database::connection();

        $stmt = $db->prepare(
            'SELECT * FROM otp_codes
             WHERE phone = :phone AND code = :code AND is_used = 0 AND expires_at > NOW()
             ORDER BY id DESC LIMIT 1'
        );
        $stmt->execute(['phone' => $phone, 'code' => $code]);
        $otp = $stmt->fetch();

        if (!$otp) {
            Response::error('کد تایید نامعتبر یا منقضی شده است', 401);
        }

        // mark it used so it can't be replayed
        $db->prepare('UPDATE otp_codes SET is_used = 1 WHERE id = :id')
            ->execute(['id' => $otp['id']]);

        // find or create the user (first login == registration, same as isNewUser in AuthModal.jsx)
        $stmt = $db->prepare('SELECT * FROM users WHERE phone = :phone');
        $stmt->execute(['phone' => $phone]);
        $user = $stmt->fetch();

        if (!$user) {
            $insert = $db->prepare('INSERT INTO users (phone) VALUES (:phone)');
            $insert->execute(['phone' => $phone]);
            $stmt->execute(['phone' => $phone]);
            $user = $stmt->fetch();
        }

        $token = Auth::generateToken((int) $user['id']);

        Response::success([
            'token' => $token,
            'user' => $this->formatUser($user),
        ]);
    }

    /** POST /api/auth/logout */
    public function logout(array $params): void
    {
        Auth::requireUser();
        Auth::revokeToken();
        Response::success(['message' => 'خروج با موفقیت انجام شد']);
    }

    /** GET /api/auth/me */
    public function me(array $params): void
    {
        $user = Auth::requireUser();
        Response::success(['user' => $this->formatUser($user)]);
    }

    /** PUT /api/auth/me  {fullName, displayName, email, birthDate} */
    public function updateMe(array $params): void
    {
        $user = Auth::requireUser();

        $fullName = Request::input('fullName', $user['full_name']);
        $displayName = Request::input('displayName', $user['display_name']);
        $email = Request::input('email', $user['email']);
        $birthDate = Request::input('birthDate', $user['birth_date']);

        if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('ایمیل معتبر نیست', 422);
        }

        $db = Database::connection();
        $stmt = $db->prepare(
            'UPDATE users SET full_name = :full_name, display_name = :display_name,
             email = :email, birth_date = :birth_date WHERE id = :id'
        );
        $stmt->execute([
            'full_name' => $fullName ?: null,
            'display_name' => $displayName ?: null,
            'email' => $email ?: null,
            'birth_date' => $birthDate ?: null,
            'id' => $user['id'],
        ]);

        $stmt = $db->prepare('SELECT * FROM users WHERE id = :id');
        $stmt->execute(['id' => $user['id']]);
        $fresh = $stmt->fetch();

        Response::success(['user' => $this->formatUser($fresh)]);
    }

    /** Shapes a DB row the way AuthContext.jsx's `user` object already looks. */
    private function formatUser(array $user): array
    {
        return [
            'id' => (int) $user['id'],
            'phone' => $user['phone'],
            'fullName' => $user['full_name'],
            'displayName' => $user['display_name'],
            'email' => $user['email'],
            'birthDate' => $user['birth_date'],
        ];
    }
}
