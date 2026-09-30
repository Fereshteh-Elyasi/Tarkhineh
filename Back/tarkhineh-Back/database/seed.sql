tarkhinehtarkhinehtarkhineh-- ===================================================================
-- Seed data - taken from the existing React mock files so the API
-- responds with real-looking content on day one. Extend freely.
--
-- IMPORTANT: import with a UTF-8 client, same as schema.sql:
--   mysql -u root --default-character-set=utf8mb4 < seed.sql
-- ===================================================================
SET NAMES utf8mb4;
USE tarkhineh;

-- ---------- menu tabs ----------
INSERT INTO menu_tabs (id, label, sort_order) VALUES
  ('main', 'غذای اصلی', 1),
  ('appetizer', 'پیش غذا', 2),
  ('dessert', 'دسر', 3),
  ('drink', 'نوشیدنی', 4);

-- ---------- menu items (subset of src/data/menuItems.js, "main" tab) ----------
-- image paths point at /uploads/menu/... ; copy the real files there (see README).
INSERT INTO menu_items
  (id, tab_id, title, description, price, old_price, discount_percent, rating, rating_count, image, category, category_label, is_bestseller)
VALUES
  ('m-koofte-berenji', 'main', 'کوفته برنجی', 'برنج سبزی کوفته لپه آرد نخودچی، گردو و زرشک و آلو پیاز', 145000, 180000, 35, 4.0, 27, '/uploads/menu/koofteh1.jpg', 'iranian', 'غذاهای ایرانی', 0),
  ('m-kashke-bademjan', 'main', 'کشک بادمجان', 'بادمجان، کشک، نعناع خشک، مغز گردو، سیر، پیاز', 95000, NULL, NULL, 5.0, 27, '/uploads/menu/kashk1.jpg', 'iranian', 'غذاهای ایرانی', 1),
  ('m-mirza-qasemi', 'main', 'میرزا قاسمی', 'بادمجان، گوجه فرنگی، تخم مرغ، سیر، رب گوجه فرنگی', 142500, 165000, 10, 5.0, 27, '/uploads/menu/mirza1.jpg', 'iranian', 'غذاهای ایرانی', 1),
  ('m-baqlagatoq', 'main', 'باقلاقاتوق', 'پاچ باقلا، شوید خشک، کره، سیر، تخم مرغ', 195000, NULL, 30, 4.0, 27, '/uploads/menu/baqla1.jpg', 'iranian', 'غذاهای ایرانی', 0),
  ('m-felafel', 'main', 'فلافل', 'نخود، پیاز، تخم گشنیز، سیر، جعفری، سیب زمینی', 80000, NULL, NULL, 3.0, 27, '/uploads/menu/felafel.jpg', 'iranian', 'غذاهای ایرانی', 0),
  ('m-lasagna', 'main', 'لازانیا', 'پاستا، سس بشامل، سبزیجات، پنیر پیتزا', 150000, 200000, 25, 5.0, 38, '/uploads/menu/lazania.jpg', 'non_iranian', 'غذاهای غیر ایرانی', 1);

INSERT INTO menu_items
  (id, tab_id, title, description, price, rating, rating_count, image, category, category_label, is_bestseller)
VALUES
  ('a-sushi', 'appetizer', 'سوشی', 'برنج سرکه، سبزیجات، نوری', 85000, 4.0, 21, '/uploads/menu/sushi.jpg', 'non_iranian', 'پیش‌غذای غیر ایرانی', 0),
  ('d-bastani', 'dessert', 'بستنی سنتی', 'بستنی زعفرانی با گلاب و پسته', 65000, 4.5, 40, '/uploads/menu/bastani.jpeg', 'dessert', 'دسر', 1),
  ('dr-doogh', 'drink', 'دوغ سنتی', 'دوغ خانگی با نعنا', 25000, 4.0, 15, '/uploads/menu/doogh.jpg', 'drink', 'نوشیدنی', 0);

-- ---------- branches (src/data/branches.js) ----------
INSERT INTO branches (id, slug, name, address, phone1, phone2, working_hours, lat, lng, image) VALUES
  (1, 'ekbatan', 'شعبه اکباتان', 'اکباتان، خیابان ریاحی، کوچه سیزدهم، ساختمان آیسا، طبقه همکف', 'شماره تماس ۱: ۵۴۸۹۱۲۵۴-۰۲۱', 'شماره تماس ۲: ۵۴۸۹۱۲۵۵-۰۲۱', 'ساعت کاری: همه‌روزه از ساعت ۱۲ تا ۲۳ بجز روزهای تعطیل', 35.7219000, 51.2775000, '/uploads/branches/chaloos.jpg'),
  (2, 'chaloos', 'شعبه چالوس', 'چالوس، خیابان امام، بعد از میدان شهرداری، جنب داروخانه دکتر اکبری', NULL, NULL, NULL, 36.6560000, 51.4206000, '/uploads/branches/chaloos1.jpg'),
  (3, 'aqdasie', 'شعبه اقدسیه', 'اقدسیه، خیابان شبستری، بعد از کوچه خرمشهر، پلاک ۸', NULL, NULL, NULL, 35.8100000, 51.4800000, '/uploads/branches/aqdasie.jpg'),
  (4, 'vanak', 'شعبه ونک', 'میدان ونک، خیابان ولیعصر، نبش کوچه نشاط، پلاک ۲۴', NULL, NULL, NULL, 35.7563000, 51.4113000, '/uploads/branches/vanak.png');

-- ---------- branch dishes (src/data/branchDishes.js) - shared list for now ----------
INSERT INTO branch_dishes (branch_id, section, name, price, discount_percent, rating, rating_count, image, sort_order) VALUES
  (1, 'featured', 'دلمه برگ کلم', 209000, 25, 5.0, 52, '/uploads/menu/dolmeh.jpg', 1),
  (1, 'featured', 'بادمجان شکم‌پر', 136000, 17, 4.0, 27, '/uploads/menu/bademjan.jpg', 2),
  (1, 'featured', 'کالزونه اسفناج', 177000, 17, 5.0, 34, '/uploads/menu/kalzoneh.jpg', 3),
  (1, 'popular', 'پنینی اسفناج', 190000, 15, 3.0, 21, '/uploads/menu/penini.jpg', 1),
  (1, 'popular', 'پیتزا پپرونی', 100000, 0, 4.0, 19, '/uploads/menu/peperoni.jpg', 2),
  (1, 'non_iranian', 'سوشی', 85000, 15, 4.0, 21, '/uploads/menu/sushi.jpg', 1),
  (1, 'non_iranian', 'لازانیا', 150000, 25, 5.0, 38, '/uploads/menu/lazania.jpg', 2);

-- ---------- reviews (src/data/review.js) ----------
INSERT INTO reviews (branch_id, name, review_date, text, rating, avatar) VALUES
  (1, 'آرزو محمدعلی‌زاده', '۲۳ اسفند ۱۴۰۱', 'از با صفا بودن شعبه اکباتان هر چی بگم کم گفتم. بهترین غذاهای گیاهی عمرمو اینجا خوردم.', 5, '/uploads/reviews/arezoo.jpg'),
  (1, 'سردار وظیفه', '۲۴ اسفند ۱۴۰۱', 'از با صفا بودن شعبه اکباتان هر چی بگم کم گفتم. بهترین غذاهای گیاهی عمرمو اینجا خوردم.', 4, '/uploads/reviews/sardar.png'),
  (1, 'علی رضایی', '۲۶ اسفند ۱۴۰۱', 'از با صفا بودن شعبه اکباتان هر چی بگم کم گفتم. بهترین غذاهای گیاهی عمرمو اینجا خوردم.', 4, '/uploads/reviews/ali.png');

-- ---------- a sample discount code, for PaymentPage.jsx "ثبت کد تخفیف" ----------
INSERT INTO discount_codes (code, percent, amount, max_discount, expires_at, is_active) VALUES
  ('TARKHINEH10', 10, NULL, 50000, '2027-12-31', 1),
  ('WELCOME20000', NULL, 20000, NULL, '2027-12-31', 1);
