<?php
// ===================================================================
// Backs PaymentPage.jsx's "ثبت کد تخفیف" box, and the payment
// confirmation step ("تایید و پرداخت" / gateway callback).
//
// This does NOT talk to a real bank. It simulates the shape of a
// real integration (Saman/Mellat/Parsian in Iran, or Stripe
// elsewhere) so you can swap in the real SDK/redirect later without
// changing how the frontend calls this endpoint.
// ===================================================================

require_once __DIR__ . '/../config/database.php';

class DiscountController
{
    /** POST /api/discount/apply  {code, subtotal} */
    public function apply(array $params): void
    {
        $code = trim((string) Request::input('code', ''));
        $subtotal = (int) Request::input('subtotal', 0);

        if ($code === '') {
            Response::error('کد تخفیف را وارد کنید', 422);
        }

        $amount = self::calculateAmount($code, $subtotal);

        if ($amount === null) {
            Response::success(['valid' => false, 'message' => 'کد تخفیف نامعتبر یا منقضی شده است']);
        }

        Response::success([
            'valid' => true,
            'amount' => $amount,
            'message' => 'کد تخفیف با موفقیت اعمال شد',
        ]);
    }

    /**
     * Shared by DiscountController::apply() and OrderController::store().
     * Returns the discount amount in Toman, or null if the code doesn't apply.
     */
    public static function calculateAmount(string $code, int $subtotal): ?int
    {
        $db = Database::connection();
        $stmt = $db->prepare(
            "SELECT * FROM discount_codes
             WHERE code = :code AND is_active = 1 AND (expires_at IS NULL OR expires_at >= CURDATE())"
        );
        $stmt->execute(['code' => $code]);
        $discount = $stmt->fetch();

        if (!$discount) {
            return null;
        }

        if ($discount['percent'] !== null) {
            $amount = (int) floor($subtotal * ((int) $discount['percent'] / 100));
            if ($discount['max_discount'] !== null) {
                $amount = min($amount, (int) $discount['max_discount']);
            }
            return $amount;
        }

        return (int) $discount['amount'];
    }

    /** POST /api/payment/confirm  {orderId, gateway?} - simulates a bank gateway callback. */
    public function confirmPayment(array $params): void
    {
        $user = Auth::requireUser();
        $orderId = (int) Request::input('orderId', 0);

        $db = Database::connection();
        $stmt = $db->prepare('SELECT * FROM orders WHERE id = :id AND user_id = :uid');
        $stmt->execute(['id' => $orderId, 'uid' => $user['id']]);
        $order = $stmt->fetch();

        if (!$order) {
            Response::notFound('سفارشی با این شناسه پیدا نشد');
        }

        if ($order['payment_status'] === 'paid') {
            Response::success(['status' => 'paid', 'trackingCode' => $order['tracking_code']]);
        }

        // TODO: this is where you'd redirect to the real gateway (Saman/Mellat/Parsian)
        // and, on its callback, verify the transaction server-to-server before marking paid.
        $trackingCode = strtoupper(bin2hex(random_bytes(6)));

        $db->prepare(
            "UPDATE orders SET payment_status = 'paid', tracking_code = :tracking_code WHERE id = :id"
        )->execute(['tracking_code' => $trackingCode, 'id' => $order['id']]);

        Response::success(['status' => 'paid', 'trackingCode' => $trackingCode]);
    }
}
