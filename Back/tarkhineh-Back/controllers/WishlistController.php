<?php
// ===================================================================
// Backs the "علاقه‌مندی‌ها" (favorites) tab in ProfilePage.jsx.
// ===================================================================

require_once __DIR__ . '/../config/database.php';

class WishlistController
{
    /** GET /api/wishlist */
    public function index(array $params): void
    {
        $user = Auth::requireUser();

        $db = Database::connection();
        $stmt = $db->prepare(
            'SELECT mi.* FROM wishlist w
             JOIN menu_items mi ON mi.id = w.menu_item_id
             WHERE w.user_id = :uid
             ORDER BY w.created_at DESC'
        );
        $stmt->execute(['uid' => $user['id']]);

        $result = array_map(function ($item) {
            return [
                'id' => $item['id'],
                'name' => $item['title'],
                'price' => (int) $item['price'],
                'rating' => (float) $item['rating'],
                'category' => $item['category_label'],
                'image' => $item['image'],
            ];
        }, $stmt->fetchAll());

        Response::success($result);
    }

    /** POST /api/wishlist  {menuItemId} */
    public function store(array $params): void
    {
        $user = Auth::requireUser();
        $menuItemId = Request::input('menuItemId');

        if (!$menuItemId) {
            Response::error('menuItemId الزامی است', 422);
        }

        $db = Database::connection();

        $exists = $db->prepare('SELECT 1 FROM menu_items WHERE id = :id');
        $exists->execute(['id' => $menuItemId]);
        if (!$exists->fetchColumn()) {
            Response::notFound('غذایی با این شناسه پیدا نشد');
        }

        $stmt = $db->prepare(
            'INSERT IGNORE INTO wishlist (user_id, menu_item_id) VALUES (:uid, :item_id)'
        );
        $stmt->execute(['uid' => $user['id'], 'item_id' => $menuItemId]);

        Response::success(['message' => 'به علاقه‌مندی‌ها اضافه شد'], 201);
    }

    /** DELETE /api/wishlist/{menuItemId} */
    public function destroy(array $params): void
    {
        $user = Auth::requireUser();

        $db = Database::connection();
        $stmt = $db->prepare('DELETE FROM wishlist WHERE user_id = :uid AND menu_item_id = :item_id');
        $stmt->execute(['uid' => $user['id'], 'item_id' => $params['menuItemId']]);

        Response::success(['message' => 'از علاقه‌مندی‌ها حذف شد']);
    }
}
