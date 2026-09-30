<?php
// ===================================================================
// Backs AddAddressModal.jsx, CheckoutInfoPage.jsx's address list, and
// ProfilePage.jsx's "آدرس‌های من" tab. All routes require login.
// ===================================================================

require_once __DIR__ . '/../config/database.php';

class AddressController
{
    /** GET /api/addresses */
    public function index(array $params): void
    {
        $user = Auth::requireUser();

        $db = Database::connection();
        $stmt = $db->prepare('SELECT * FROM addresses WHERE user_id = :uid ORDER BY is_default DESC, id DESC');
        $stmt->execute(['uid' => $user['id']]);

        Response::success(array_map([$this, 'formatAddress'], $stmt->fetchAll()));
    }

    /** POST /api/addresses  {label, phone, fullAddress, isSelf, recipientName, lat, lng} */
    public function store(array $params): void
    {
        $user = Auth::requireUser();

        $label = trim((string) Request::input('label', ''));
        $fullAddress = trim((string) Request::input('fullAddress', ''));

        if ($label === '' || $fullAddress === '') {
            Response::error('عنوان و آدرس دقیق الزامی است', 422);
        }

        $isSelf = (bool) Request::input('isSelf', true);

        $db = Database::connection();
        $stmt = $db->prepare(
            'INSERT INTO addresses (user_id, label, phone, full_address, is_self, recipient_name, lat, lng)
             VALUES (:user_id, :label, :phone, :full_address, :is_self, :recipient_name, :lat, :lng)'
        );
        $stmt->execute([
            'user_id' => $user['id'],
            'label' => $label,
            'phone' => Request::input('phone', null),
            'full_address' => $fullAddress,
            'is_self' => $isSelf ? 1 : 0,
            'recipient_name' => $isSelf ? null : Request::input('recipientName', null),
            'lat' => Request::input('lat', null),
            'lng' => Request::input('lng', null),
        ]);

        $id = (int) $db->lastInsertId();
        $stmt = $db->prepare('SELECT * FROM addresses WHERE id = :id');
        $stmt->execute(['id' => $id]);

        Response::success($this->formatAddress($stmt->fetch()), 201);
    }

    /** PUT /api/addresses/{id} */
    public function update(array $params): void
    {
        $user = Auth::requireUser();
        $address = $this->findOwned((int) $params['id'], (int) $user['id']);

        $isSelf = (bool) Request::input('isSelf', $address['is_self']);

        $db = Database::connection();
        $stmt = $db->prepare(
            'UPDATE addresses SET label = :label, phone = :phone, full_address = :full_address,
             is_self = :is_self, recipient_name = :recipient_name,
             lat = :lat, lng = :lng, is_default = :is_default
             WHERE id = :id'
        );
        $stmt->execute([
            'label' => Request::input('label', $address['label']),
            'phone' => Request::input('phone', $address['phone']),
            'full_address' => Request::input('fullAddress', $address['full_address']),
            'is_self' => $isSelf ? 1 : 0,
            'recipient_name' => $isSelf ? null : Request::input('recipientName', $address['recipient_name']),
            'lat' => Request::input('lat', $address['lat']),
            'lng' => Request::input('lng', $address['lng']),
            'is_default' => (bool) Request::input('isDefault', $address['is_default']) ? 1 : 0,
            'id' => $address['id'],
        ]);

        // if this address became the default, unset default on the user's other addresses
        if ((bool) Request::input('isDefault', false)) {
            $db->prepare('UPDATE addresses SET is_default = 0 WHERE user_id = :uid AND id != :id')
               ->execute(['uid' => $user['id'], 'id' => $address['id']]);
        }

        $stmt = $db->prepare('SELECT * FROM addresses WHERE id = :id');
        $stmt->execute(['id' => $address['id']]);

        Response::success($this->formatAddress($stmt->fetch()));
    }

    /** DELETE /api/addresses/{id} */
    public function destroy(array $params): void
    {
        $user = Auth::requireUser();
        $address = $this->findOwned((int) $params['id'], (int) $user['id']);

        $db = Database::connection();
        $db->prepare('DELETE FROM addresses WHERE id = :id')->execute(['id' => $address['id']]);

        Response::success(['message' => 'آدرس حذف شد']);
    }

    private function findOwned(int $id, int $userId): array
    {
        $db = Database::connection();
        $stmt = $db->prepare('SELECT * FROM addresses WHERE id = :id AND user_id = :uid');
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        $address = $stmt->fetch();

        if (!$address) {
            Response::notFound('آدرسی با این شناسه پیدا نشد');
        }

        return $address;
    }

    private function formatAddress(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'label' => $row['label'],
            'phone' => $row['phone'],
            'fullAddress' => $row['full_address'],
            'isSelf' => (bool) $row['is_self'],
            'recipientName' => $row['recipient_name'],
            'lat' => $row['lat'] !== null ? (float) $row['lat'] : null,
            'lng' => $row['lng'] !== null ? (float) $row['lng'] : null,
            'isDefault' => (bool) $row['is_default'],
        ];
    }
}
