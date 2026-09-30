<?php
// ===================================================================
// Replaces src/api/searchApi.js's fetchSearchResults(query).
// The mock filtered a static searchableItems array by substring;
// here we search the real menu_items table instead, so search
// results are always in sync with the menu.
// ===================================================================

require_once __DIR__ . '/../config/database.php';

class SearchController
{
    /** GET /api/search?q=... */
    public function index(array $params): void
    {
        $q = trim((string) Request::query('q', ''));

        if ($q === '') {
            Response::success([]);
        }

        // mirror normalizeForSearch() from utils/format.js: unify ی/ي and ک/ك
        $normalized = str_replace(['ي', 'ك'], ['ی', 'ک'], $q);

        $db = Database::connection();
        $stmt = $db->prepare(
            "SELECT * FROM menu_items
             WHERE REPLACE(REPLACE(title, 'ي', 'ی'), 'ك', 'ک') LIKE :q
             ORDER BY rating_count DESC
             LIMIT 30"
        );
        $stmt->execute(['q' => '%' . $normalized . '%']);
        $items = $stmt->fetchAll();

        $result = array_map(function ($item) {
            return [
                'id' => $item['id'],
                'name' => $item['title'],
                'discountPercent' => $item['discount_percent'] !== null ? (int) $item['discount_percent'] : 0,
                'oldPrice' => $item['old_price'] !== null ? (int) $item['old_price'] : null,
                'price' => (int) $item['price'],
                'rating' => (float) $item['rating'],
                'ratingCount' => (int) $item['rating_count'],
                'image' => $item['image'],
            ];
        }, $items);

        Response::success($result);
    }
}
