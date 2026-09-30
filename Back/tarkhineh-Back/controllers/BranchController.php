<?php
// ===================================================================
// Replaces src/api/branchesApi.js and src/api/branchDishesApi.js.
// ===================================================================

require_once __DIR__ . '/../config/database.php';

class BranchController
{
    /** GET /api/branches */
    public function index(array $params): void
    {
        $db = Database::connection();
        $branches = $db->query('SELECT * FROM branches ORDER BY id')->fetchAll();

        Response::success(array_map([$this, 'formatBranch'], $branches));
    }

    /** GET /api/branches/{slug} */
    public function show(array $params): void
    {
        $branch = $this->findBySlug($params['slug']);
        if (!$branch) {
            Response::notFound('شعبه‌ای با این آدرس پیدا نشد');
        }

        $formatted = $this->formatBranch($branch);
        // same extra fields fetchBranchBySlug() adds on top of the base branch object
        $formatted['workingHours'] = $branch['working_hours'];
        $formatted['phone1'] = $branch['phone1'];
        $formatted['phone2'] = $branch['phone2'];

        Response::success($formatted);
    }

    /** GET /api/branches/{slug}/dishes */
    public function dishes(array $params): void
    {
        $branch = $this->findBySlug($params['slug']);
        if (!$branch) {
            Response::notFound('شعبه‌ای با این آدرس پیدا نشد');
        }

        $db = Database::connection();
        $stmt = $db->prepare(
            'SELECT * FROM branch_dishes WHERE branch_id = :id AND section = :section ORDER BY sort_order'
        );

        $bySection = function (string $section) use ($stmt, $branch) {
            $stmt->execute(['id' => $branch['id'], 'section' => $section]);
            return array_map(function ($row) {
                return [
                    'id' => 'b-' . $row['id'],
                    'name' => $row['name'],
                    'discountPercent' => (int) $row['discount_percent'],
                    'price' => (int) $row['price'],
                    'rating' => (float) $row['rating'],
                    'ratingCount' => (int) $row['rating_count'],
                    'image' => $row['image'],
                ];
            }, $stmt->fetchAll());
        };

        Response::success([
            'featured' => $bySection('featured'),
            'popular' => $bySection('popular'),
            'nonIranian' => $bySection('non_iranian'),
        ]);
    }

    /** GET /api/branches/{slug}/reviews */
    public function reviews(array $params): void
    {
        $branch = $this->findBySlug($params['slug']);
        if (!$branch) {
            Response::notFound('شعبه‌ای با این آدرس پیدا نشد');
        }

        $db = Database::connection();
        $stmt = $db->prepare(
            'SELECT * FROM reviews WHERE branch_id = :id ORDER BY created_at DESC'
        );
        $stmt->execute(['id' => $branch['id']]);

        $result = array_map(function ($row) {
            return [
                'id' => (int) $row['id'],
                'name' => $row['name'],
                'date' => $row['review_date'],
                'text' => $row['text'],
                'rating' => (int) $row['rating'],
                'avatar' => $row['avatar'],
            ];
        }, $stmt->fetchAll());

        Response::success($result);
    }

    private function findBySlug(string $slug): ?array
    {
        $db = Database::connection();
        $stmt = $db->prepare('SELECT * FROM branches WHERE slug = :slug');
        $stmt->execute(['slug' => $slug]);
        $branch = $stmt->fetch();
        return $branch ?: null;
    }

    private function formatBranch(array $branch): array
    {
        $db = Database::connection();
        $stmt = $db->prepare(
            'SELECT image_url FROM branch_images WHERE branch_id = :id ORDER BY sort_order'
        );
        $stmt->execute(['id' => $branch['id']]);
        $extraImages = $stmt->fetchAll(PDO::FETCH_COLUMN);

        return [
            'slug' => $branch['slug'],
            'name' => $branch['name'],
            'address' => $branch['address'],
            'image' => $branch['image'],
            'images' => $extraImages ?: array_filter([$branch['image']]),
            'lat' => $branch['lat'] !== null ? (float) $branch['lat'] : null,
            'lng' => $branch['lng'] !== null ? (float) $branch['lng'] : null,
        ];
    }
}
