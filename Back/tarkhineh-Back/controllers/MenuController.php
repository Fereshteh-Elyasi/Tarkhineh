<?php
// ===================================================================
// Replaces src/api/menuApi.js's fetchTypeTabs() and fetchMenuItems(tab).
// ===================================================================

require_once __DIR__ . '/../config/database.php';

class MenuController
{
    /** GET /api/menu/tabs */
    public function tabs(array $params): void
    {
        $db = Database::connection();
        $rows = $db->query('SELECT id, label FROM menu_tabs ORDER BY sort_order')->fetchAll();

        Response::success($rows);
    }

    /** GET /api/menu/items?tab=main */
    public function items(array $params): void
    {
        $tab = Request::query('tab');
        if (!$tab) {
            Response::error('پارامتر tab الزامی است', 422);
        }

        $db = Database::connection();

        $tabExists = $db->prepare('SELECT 1 FROM menu_tabs WHERE id = :id');
        $tabExists->execute(['id' => $tab]);
        if (!$tabExists->fetchColumn()) {
            Response::notFound("تبی با شناسه «{$tab}» پیدا نشد");
        }

        $stmt = $db->prepare('SELECT * FROM menu_items WHERE tab_id = :tab ORDER BY id');
        $stmt->execute(['tab' => $tab]);
        $items = $stmt->fetchAll();

        $imagesStmt = $db->prepare(
            'SELECT image_url FROM menu_item_images WHERE menu_item_id = :id ORDER BY sort_order'
        );

        $result = array_map(function ($item) use ($imagesStmt) {
            $imagesStmt->execute(['id' => $item['id']]);
            $extraImages = $imagesStmt->fetchAll(PDO::FETCH_COLUMN);

            return [
                'id' => $item['id'],
                'title' => $item['title'],
                'description' => $item['description'],
                'price' => (int) $item['price'],
                'oldPrice' => $item['old_price'] !== null ? (int) $item['old_price'] : null,
                'discountPercent' => $item['discount_percent'] !== null ? (int) $item['discount_percent'] : null,
                'rating' => (float) $item['rating'],
                'ratingCount' => (int) $item['rating_count'],
                'image' => $item['image'],
                // fall back to the single main image if no gallery rows exist yet
                'images' => $extraImages ?: array_filter([$item['image']]),
                'category' => $item['category'],
                'categoryLabel' => $item['category_label'],
                'isBestseller' => (bool) $item['is_bestseller'],
            ];
        }, $items);

        Response::success($result);
    }
}
