<?php
// ===================================================================
// Backs CheckoutInfoPage.jsx ("ثبت سفارش"), PaymentPage.jsx, and the
// "پیگیری سفارشات" tab in ProfilePage.jsx.
//
// NOTE ON PRICES: to keep this example focused, item prices are taken
// from what the cart sends (CartContext.jsx already stores full item
// data, not just an id). In production you should re-look each
// menu_item_id up in the DB and use ITS price, so a tampered request
// body can never change what the customer actually pays.
// ===================================================================

require_once __DIR__ . '/../config/database.php';

class OrderController
{
    private const STATUS_LABEL = [
        'active' => 'جاری',
        'delivered' => 'تحویل شده',
        'cancelled' => 'لغو شده',
    ];

    private const DELIVERY_LABEL = [
        'courier' => 'ارسال توسط پیک',
        'pickup' => 'تحویل حضوری',
    ];

    /** GET /api/orders */
    public function index(array $params): void
    {
        $user = Auth::requireUser();

        $db = Database::connection();
        $stmt = $db->prepare('SELECT * FROM orders WHERE user_id = :uid ORDER BY id DESC');
        $stmt->execute(['uid' => $user['id']]);

        Response::success(array_map([$this, 'formatOrder'], $stmt->fetchAll()));
    }

    /** GET /api/orders/{id} */
    public function show(array $params): void
    {
        $user = Auth::requireUser();
        $order = $this->findOwned((int) $params['id'], (int) $user['id']);

        Response::success($this->formatOrder($order));
    }

    /** POST /api/orders
     *  { branchSlug?, deliveryType, addressId?, note?, items:[{id,title,price,oldPrice?,discountPercent?,qty}],
     *    paymentMethod, paymentGateway?, discountCode? }
     */
    public function store(array $params): void
    {
        $user = Auth::requireUser();
        $db = Database::connection();

        $items = Request::input('items', []);
        if (!is_array($items) || count($items) === 0) {
            Response::error('سبد خرید خالی است', 422);
        }

        $deliveryType = Request::input('deliveryType', 'courier');
        if (!in_array($deliveryType, ['courier', 'pickup'], true)) {
            Response::error('روش تحویل نامعتبر است', 422);
        }

        $addressId = Request::input('addressId');
        if ($deliveryType === 'courier') {
            if (!$addressId) {
                Response::error('برای ارسال توسط پیک باید یک آدرس انتخاب شود', 422);
            }
            $addrStmt = $db->prepare('SELECT id FROM addresses WHERE id = :id AND user_id = :uid');
            $addrStmt->execute(['id' => $addressId, 'uid' => $user['id']]);
            if (!$addrStmt->fetchColumn()) {
                Response::notFound('آدرسی با این شناسه پیدا نشد');
            }
        } else {
            $addressId = null;
        }

        $branchId = null;
        $branchSlug = Request::input('branchSlug');
        if ($branchSlug) {
            $branchStmt = $db->prepare('SELECT id FROM branches WHERE slug = :slug');
            $branchStmt->execute(['slug' => $branchSlug]);
            $branchId = $branchStmt->fetchColumn() ?: null;
        }

        // ---- totals, same arithmetic as CartContext.jsx (subtotal/discountTotal) ----
        $subtotal = 0;
        $discountTotal = 0;
        foreach ($items as $item) {
            $price = (int) ($item['price'] ?? 0);
            $qty = max(1, (int) ($item['qty'] ?? 1));
            $subtotal += $price * $qty;

            if (!empty($item['discountPercent']) && !empty($item['oldPrice'])) {
                $discountTotal += ((int) $item['oldPrice'] - $price) * $qty;
            }
        }

        $shippingCost = $deliveryType === 'pickup' ? 0 : SHIPPING_COST;

        // ---- optional discount code ----
        $discountCode = Request::input('discountCode');
        $discountCodeAmount = 0;
        if ($discountCode) {
            $discountCodeAmount = DiscountController::calculateAmount($discountCode, $subtotal);
        }

        $total = max(0, $subtotal + $shippingCost - $discountCodeAmount);

        $paymentMethod = Request::input('paymentMethod', 'online');
        if (!in_array($paymentMethod, ['online', 'cod'], true)) {
            Response::error('روش پرداخت نامعتبر است', 422);
        }

        $db->beginTransaction();
        try {
            $stmt = $db->prepare(
                'INSERT INTO orders
                 (user_id, branch_id, address_id, delivery_type, note, subtotal, discount_total,
                  shipping_cost, discount_code, discount_code_amount, total, payment_method, payment_gateway)
                 VALUES
                 (:user_id, :branch_id, :address_id, :delivery_type, :note, :subtotal, :discount_total,
                  :shipping_cost, :discount_code, :discount_code_amount, :total, :payment_method, :payment_gateway)'
            );
            $stmt->execute([
                'user_id' => $user['id'],
                'branch_id' => $branchId,
                'address_id' => $addressId,
                'delivery_type' => $deliveryType,
                'note' => Request::input('note', null),
                'subtotal' => $subtotal,
                'discount_total' => max(0, $discountTotal),
                'shipping_cost' => $shippingCost,
                'discount_code' => $discountCode ?: null,
                'discount_code_amount' => $discountCodeAmount,
                'total' => $total,
                'payment_method' => $paymentMethod,
                'payment_gateway' => Request::input('paymentGateway', null),
            ]);

            $orderId = (int) $db->lastInsertId();

            $itemStmt = $db->prepare(
                'INSERT INTO order_items (order_id, menu_item_id, name, price, qty) VALUES (:order_id, :menu_item_id, :name, :price, :qty)'
            );
            foreach ($items as $item) {
                $itemStmt->execute([
                    'order_id' => $orderId,
                    'menu_item_id' => $item['id'] ?? null,
                    'name' => $item['title'] ?? ($item['name'] ?? ''),
                    'price' => (int) ($item['price'] ?? 0),
                    'qty' => max(1, (int) ($item['qty'] ?? 1)),
                ]);
            }

            // cash-on-delivery orders don't need a payment step; mark them paid-on-delivery-pending as is.
            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            Response::error('ثبت سفارش با خطا مواجه شد', 500);
        }

        $stmt = $db->prepare('SELECT * FROM orders WHERE id = :id');
        $stmt->execute(['id' => $orderId]);

        Response::success($this->formatOrder($stmt->fetch()), 201);
    }

    /** POST /api/orders/{id}/cancel */
    public function cancel(array $params): void
    {
        $user = Auth::requireUser();
        $order = $this->findOwned((int) $params['id'], (int) $user['id']);

        if ($order['status'] !== 'active') {
            Response::error('فقط سفارش‌های جاری قابل لغو هستند', 422);
        }

        $db = Database::connection();
        $db->prepare("UPDATE orders SET status = 'cancelled' WHERE id = :id")
           ->execute(['id' => $order['id']]);

        $order['status'] = 'cancelled';
        Response::success($this->formatOrder($order));
    }

    private function findOwned(int $id, int $userId): array
    {
        $db = Database::connection();
        $stmt = $db->prepare('SELECT * FROM orders WHERE id = :id AND user_id = :uid');
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        $order = $stmt->fetch();

        if (!$order) {
            Response::notFound('سفارشی با این شناسه پیدا نشد');
        }

        return $order;
    }

    /** Shapes a DB row + its items the way the OrderCard in ProfilePage.jsx expects. */
    private function formatOrder(array $order): array
    {
        $db = Database::connection();

        $branch = null;
        if ($order['branch_id']) {
            $stmt = $db->prepare('SELECT name, address FROM branches WHERE id = :id');
            $stmt->execute(['id' => $order['branch_id']]);
            $branch = $stmt->fetch() ?: null;
        }

        $itemsStmt = $db->prepare('SELECT name, price, qty FROM order_items WHERE order_id = :id');
        $itemsStmt->execute(['id' => $order['id']]);
        $items = array_map(fn($i) => ['name' => $i['name'], 'price' => (int) $i['price'], 'qty' => (int) $i['qty']], $itemsStmt->fetchAll());

        $createdAt = strtotime($order['created_at']);

        return [
            'id' => (string) $order['id'],
            'branch' => $branch,
            'date' => date('Y-m-d', $createdAt), // format on the frontend with your Persian-date util, same as elsewhere
            'time' => date('H:i', $createdAt),
            'deliveryEstimate' => $order['delivery_estimate'],
            'deliveryType' => self::DELIVERY_LABEL[$order['delivery_type']] ?? $order['delivery_type'],
            'status' => self::STATUS_LABEL[$order['status']] ?? $order['status'],
            'subtotal' => (int) $order['subtotal'],
            'discount' => (int) $order['discount_total'],
            'shippingCost' => (int) $order['shipping_cost'],
            'discountCode' => $order['discount_code'],
            'discountCodeAmount' => (int) $order['discount_code_amount'],
            'total' => (int) $order['total'],
            'paymentMethod' => $order['payment_method'],
            'paymentStatus' => $order['payment_status'],
            'trackingCode' => $order['tracking_code'],
            'items' => $items,
        ];
    }
}
